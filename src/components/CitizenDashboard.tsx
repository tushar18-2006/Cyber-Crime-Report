import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Eye,
  PlusCircle,
  PhoneCall,
  Search,
  Bot,
  Shield,
  FileCheck,
  Send,
  User as UserIcon,
  X,
  Upload,
} from 'lucide-react';
import { Complaint, User, ChatMessage, NotificationItem } from '../types';
import { api } from '../services/api';

interface CitizenDashboardProps {
  currentUser: User;
  complaints: Complaint[];
  onOpenComplaintForm: () => void;
  onOpenAIChatbot: () => void;
  onRefreshData: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  currentUser,
  complaints,
  onOpenComplaintForm,
  onOpenAIChatbot,
  onRefreshData,
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter complaints for current citizen
  const citizenComplaints = complaints.filter(
    (c) => c.complainantId === currentUser.id || c.complainantPhone === currentUser.phone
  );

  const activeCases = citizenComplaints.filter(
    (c) => !['Solved', 'Closed', 'Rejected'].includes(c.status)
  ).length;

  const solvedCases = citizenComplaints.filter((c) => c.status === 'Solved').length;

  const totalLoss = citizenComplaints.reduce(
    (acc, c) => acc + (c.financialLossAmount || 0),
    0
  );

  const filteredComplaints = citizenComplaints.filter((c) =>
    c.ackNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load chat messages when selecting a complaint
  const handleSelectComplaint = async (c: Complaint) => {
    setSelectedComplaint(c);
    try {
      const msgs = await api.getChatMessages(c.id);
      setChatMessages(msgs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedComplaint) return;

    setIsSendingChat(true);
    try {
      const msg = await api.sendChatMessage(selectedComplaint.id, {
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: 'citizen',
        message: newMessage,
      });
      setChatMessages((prev) => [...prev, msg]);
      setNewMessage('');
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 text-[#E0E2E6]">
      {/* Welcome Banner */}
      <div className="bg-[#0F1218] border border-white/10 rounded-sm p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-blue-500">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-sm">
              CITIZEN DESK // NODE active
            </span>
            <span className="text-[11px] text-slate-400 font-mono">// SESSION SECURE</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white mt-1">
            {currentUser.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Track cyber crime complaints, review investigation logs, and communicate directly with assigned cyber officers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenComplaintForm}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-sm shadow-lg transition"
          >
            <PlusCircle className="w-4 h-4" />
            File New Complaint
          </button>

          <button
            onClick={onOpenAIChatbot}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-blue-400 text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm border border-blue-500/30 transition"
          >
            <Bot className="w-4 h-4 text-blue-400" />
            CyberMitra AI
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F1218] border border-white/10 p-5 rounded-sm border-l-2 border-l-blue-500 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-mono tracking-widest">
            <span>TOTAL FILED</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-2">
            {citizenComplaints.length}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">LODGED COMPLAINTS</div>
        </div>

        <div className="bg-[#0F1218] border border-white/10 p-5 rounded-sm border-l-2 border-l-amber-500 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-mono tracking-widest">
            <span>ACTIVE INVESTIGATION</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-2">
            {activeCases}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">IN PROGRESS WITH OFFICERS</div>
        </div>

        <div className="bg-[#0F1218] border border-white/10 p-5 rounded-sm border-l-2 border-l-emerald-500 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-mono tracking-widest">
            <span>SOLVED / CLOSED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-2">
            {solvedCases}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">CASE DISPOSITION ISSUED</div>
        </div>

        <div className="bg-[#0F1218] border border-white/10 p-5 rounded-sm border-l-2 border-l-rose-500 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-mono tracking-widest">
            <span>FINANCIAL LOSS</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-rose-400 mt-2">
            ₹{totalLoss.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">TOTAL REPORTED LOSS</div>
        </div>
      </div>
      {/* Main Complaints List */}
      <div className="bg-[#0F1218] border border-white/10 rounded-sm shadow-xl overflow-hidden">
        <div className="p-4 bg-[#0A0C10] border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" /> Complaint Records ({filteredComplaints.length})
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter ACK / Title..."
              className="w-full bg-[#0F1218] border border-white/10 rounded-sm pl-8 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
          {filteredComplaints.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No complaint records found under your account. Click "File New Complaint" to lodge an incident report.
            </div>
          ) : (
            filteredComplaints.map((c) => (
              <div
                key={c.id}
                className="p-4 hover:bg-white/5 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-blue-400 text-xs bg-blue-500/10 px-2 py-0.5 rounded-sm border border-blue-500/30">
                      {c.ackNumber}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      {c.category}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm border ${
                        c.status === 'Solved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : c.status === 'Under Investigation' || c.status === 'Investigation In Progress'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : c.status === 'Closed'
                          ? 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">{c.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{c.description}</p>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pt-1">
                    <span>FILED: {new Date(c.filedAt || c.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>OFFICER: {c.assignedOfficerName || 'UNASSIGNED'}</span>
                    {c.financialLossAmount && (
                      <>
                        <span>•</span>
                        <span className="text-rose-400 font-bold">₹{c.financialLossAmount.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSelectComplaint(c)}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-sm transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> Track & Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Complaint Detail & Officer Chat Drawer / Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded">
                  ACK: {selectedComplaint.ackNumber}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Complaint & Investigation Info */}
              <div className="space-y-4 font-mono text-xs">
                <div className="bg-[#0A0C10] p-4 rounded-sm border border-white/10 space-y-2">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">CATEGORY:</span>
                    <span className="text-blue-400 font-bold uppercase">{selectedComplaint.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">STATUS:</span>
                    <span className="font-bold text-emerald-400 uppercase">{selectedComplaint.status}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-400">ASSIGNED OFFICER:</span>
                    <span className="text-slate-200 font-bold uppercase">{selectedComplaint.assignedOfficerName || 'UNASSIGNED'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CLAIMED FINANCIAL LOSS:</span>
                    <span className="text-rose-400 font-bold">₹{selectedComplaint.financialLossAmount?.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    INCIDENT BRIEF:
                  </h4>
                  <p className="text-xs text-slate-300 bg-[#0A0C10] p-3 rounded-sm border border-white/10 whitespace-pre-wrap leading-relaxed font-sans">
                    {selectedComplaint.description}
                  </p>
                </div>

                {/* Evidence Attachments */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    EVIDENCE ATTACHED ({selectedComplaint.evidence.length}):
                  </h4>
                  <div className="space-y-2">
                    {selectedComplaint.evidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="bg-[#0A0C10] border border-white/10 p-2.5 rounded-sm flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="truncate text-slate-200 font-bold uppercase text-[11px]">{ev.fileName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{ev.fileSize}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investigation Notes History */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    OFFICIAL DISPOSITION UPDATES:
                  </h4>
                  <div className="space-y-2">
                    {selectedComplaint.notes
                      .filter((n) => !n.isPrivate)
                      .map((note) => (
                        <div
                          key={note.id}
                          className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-sm text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-blue-400 uppercase">
                            <span className="font-bold">{note.officerName}</span>
                            <span>
                              {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-300 font-sans text-xs">{note.note}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Chat with Officer */}
              <div className="bg-[#0A0C10] border border-white/10 rounded-sm p-4 flex flex-col h-[420px]">
                <div className="border-b border-white/10 pb-2 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Investigator Direct Terminal
                    </span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded-sm border border-emerald-500/30">
                    ENCRYPTED NODE
                  </span>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 p-2 font-sans">
                  {chatMessages.length === 0 ? (
                    <p className="text-center text-xs text-slate-500 py-8 italic">
                      No messages yet. Send a query to your investigating officer below.
                    </p>
                  ) : (
                    chatMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                            }`}
                          >
                            <div className="text-[10px] opacity-75 font-semibold mb-1">
                              {msg.senderName} ({msg.senderRole})
                            </div>
                            <p>{msg.message}</p>
                          </div>
                          <span className="text-[9px] text-slate-500 mt-0.5 font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type message to investigator..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isSendingChat}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
