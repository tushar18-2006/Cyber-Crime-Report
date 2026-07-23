import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  Filter,
  Send,
  Sparkles,
  Plus,
  Eye,
  ChevronDown,
  X,
  FileCheck,
} from 'lucide-react';
import { Complaint, User, ChatMessage, ComplaintStatus } from '../types';
import { api } from '../services/api';

interface OfficerDashboardProps {
  currentOfficer: User;
  complaints: Complaint[];
  onRefreshData: () => void;
}

const STATUS_OPTIONS: ComplaintStatus[] = [
  'Under Review',
  'Investigation In Progress',
  'Action Taken',
  'Solved',
  'Closed',
  'Rejected',
];

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  currentOfficer,
  complaints,
  onRefreshData,
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusToUpdate, setStatusToUpdate] = useState<ComplaintStatus>('Investigation In Progress');
  const [newInvestigationNote, setNewInvestigationNote] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Filter complaints assigned to this officer (or unassigned queue)
  const officerComplaints = complaints.filter(
    (c) => c.assignedOfficerId === currentOfficer.id || !c.assignedOfficerId
  );

  const filtered = officerComplaints.filter((c) => {
    const matchesSearch =
      c.ackNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complainantName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'All' ? true : c.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSelectComplaint = async (c: Complaint) => {
    setSelectedComplaint(c);
    setStatusToUpdate(c.status);
    try {
      const msgs = await api.getChatMessages(c.id);
      setChatMessages(msgs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatusAndNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsUpdatingStatus(true);
    try {
      const updated = await api.updateComplaintStatus(selectedComplaint.id, {
        status: statusToUpdate,
        note: newInvestigationNote,
        officerId: currentOfficer.id,
        officerName: currentOfficer.name,
        isPrivate: isPrivateNote,
      });

      setSelectedComplaint(updated);
      setNewInvestigationNote('');
      onRefreshData();
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !selectedComplaint) return;

    try {
      const msg = await api.sendChatMessage(selectedComplaint.id, {
        senderId: currentOfficer.id,
        senderName: currentOfficer.name,
        senderRole: 'officer',
        message: newChatMessage,
      });
      setChatMessages((prev) => [...prev, msg]);
      setNewChatMessage('');
    } catch (err) {
      alert('Failed to send message.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 text-[#E0E2E6]">
      {/* Officer Header Banner */}
      <div className="bg-[#0F1218] border border-white/10 rounded-sm p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-blue-500">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-sm">
              OFFICER INVESTIGATION DESK
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              BADGE: {currentOfficer.badgeNumber || 'CYBER-OFF-815'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white mt-1">
            {currentOfficer.name} <span className="not-italic text-sm font-mono text-slate-400">[{currentOfficer.department || 'CYBER INVESTIGATION SQUAD'}]</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Review assigned cyber cases, freeze beneficiary bank accounts, add investigation logs, and communicate with victims.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0A0C10] p-3.5 rounded-sm border border-white/10 text-right">
            <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest block">ACTIVE CASES</span>
            <span className="text-xl font-bold text-blue-400 font-mono">
              {officerComplaints.filter((c) => c.assignedOfficerId === currentOfficer.id).length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Investigation Case Table */}
      <div className="bg-[#0F1218] border border-white/10 rounded-sm shadow-xl overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 bg-[#0A0C10] border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> Assigned Queue ({filtered.length})
          </h3>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-[#0F1218] border border-white/10 text-xs font-mono text-slate-200 px-3 py-1.5 rounded-sm focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Investigation In Progress">In Progress</option>
              <option value="Action Taken">Action Taken</option>
              <option value="Solved">Solved</option>
            </select>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ACK, Name..."
                className="w-full bg-[#0F1218] border border-white/10 rounded-sm pl-8 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Queue Items */}
        <div className="divide-y divide-slate-800/80 max-h-[550px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No cases found matching filter criteria.
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="p-4 hover:bg-slate-800/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-400 text-xs bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      {c.ackNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {c.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        c.status === 'Solved'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : c.status === 'Investigation In Progress'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                      }`}
                    >
                      {c.status}
                    </span>

                    {c.aiAnalysis && (
                      <span className="text-[10px] bg-amber-950/60 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                        <Sparkles className="w-3 h-3 text-amber-400" /> AI Risk: {c.aiAnalysis.riskScore}/100
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-white">{c.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>Complainant: <strong className="text-slate-200">{c.complainantName}</strong> ({c.complainantPhone})</span>
                    <span>Loss: <strong className="text-rose-400">₹{c.financialLossAmount?.toLocaleString() || '0'}</strong></span>
                    <span>Filed: {new Date(c.filedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSelectComplaint(c)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> Investigate & Log
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Investigation Details & Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded">
                    ACK: {selectedComplaint.ackNumber}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    Category: {selectedComplaint.category}
                  </span>
                </div>
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
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Col 1 & 2: Case Details & Investigation Logs */}
              <div className="lg:col-span-2 space-y-6">
                {/* Victim & Suspect Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <h4 className="font-bold text-indigo-300 uppercase tracking-wider mb-2">Complainant Details</h4>
                    <div><span className="text-slate-400">Name:</span> <strong className="text-white">{selectedComplaint.complainantName}</strong></div>
                    <div><span className="text-slate-400">Phone:</span> <strong className="text-slate-200">{selectedComplaint.complainantPhone}</strong></div>
                    <div><span className="text-slate-400">Email:</span> <span className="text-slate-300">{selectedComplaint.complainantEmail}</span></div>
                    <div><span className="text-slate-400">Financial Loss:</span> <strong className="text-rose-400">₹{selectedComplaint.financialLossAmount?.toLocaleString()}</strong></div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-2">Suspect Details</h4>
                    <div><span className="text-slate-400">Alias/Name:</span> <span className="text-slate-200 font-semibold">{selectedComplaint.suspectDetails?.name || 'Unknown'}</span></div>
                    <div><span className="text-slate-400">Phone / UPI:</span> <span className="text-indigo-300 font-mono font-bold">{selectedComplaint.suspectDetails?.phoneOrUpiId || 'N/A'}</span></div>
                    <div><span className="text-slate-400">Bank Acc No:</span> <span className="text-slate-200 font-mono">{selectedComplaint.suspectDetails?.bankAccountNo || 'N/A'}</span></div>
                    <div><span className="text-slate-400">Phishing URL:</span> <span className="text-indigo-400 underline">{selectedComplaint.suspectDetails?.websiteUrl || 'N/A'}</span></div>
                  </div>
                </div>

                {/* AI Automated Fraud Assessment */}
                {selectedComplaint.aiAnalysis && (
                  <div className="bg-indigo-950/30 border border-indigo-800/60 rounded-xl p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" /> AI Automated Fraud Pattern Analysis
                      </span>
                      <span className="font-mono font-bold text-amber-400 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded">
                        Risk Score: {selectedComplaint.aiAnalysis.riskScore}/100 ({selectedComplaint.aiAnalysis.urgencyLevel})
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Key System Insights:
                    </p>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                      {selectedComplaint.aiAnalysis.keyInsights.map((insight, i) => (
                        <li key={i}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Investigation Notes & Action Form */}
                <form onSubmit={handleUpdateStatusAndNote} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Add Official Investigation Log / Status Update
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Change Investigation Status
                      </label>
                      <select
                        value={statusToUpdate}
                        onChange={(e) => setStatusToUpdate(e.target.value as ComplaintStatus)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 font-bold focus:outline-none"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="privateNote"
                        checked={isPrivateNote}
                        onChange={(e) => setIsPrivateNote(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                      />
                      <label htmlFor="privateNote" className="text-xs text-slate-300">
                        Mark as Private / Department Internal Note
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Investigation Note / Section 91 CrPC Action Taken
                    </label>
                    <textarea
                      rows={3}
                      value={newInvestigationNote}
                      onChange={(e) => setNewInvestigationNote(e.target.value)}
                      placeholder="e.g. Issued freezing order to bank manager / blocked domain at CERT-In level..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingStatus}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
                  >
                    {isUpdatingStatus ? 'Updating...' : 'Save Investigation Log'}
                  </button>
                </form>

                {/* Log History */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Case Timeline Notes History:
                  </h4>
                  <div className="space-y-2">
                    {selectedComplaint.notes.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          n.isPrivate
                            ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-indigo-400">
                            {n.officerName} {n.isPrivate && '(PRIVATE NOTE)'}
                          </span>
                          <span className="font-mono">{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                        <p>{n.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 3: Complainant Live Chat */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col h-[520px]">
                <div className="border-b border-slate-800 pb-2 mb-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" /> Direct Complainant Chat
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Communicating with {selectedComplaint.complainantName}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 p-2">
                  {chatMessages.length === 0 ? (
                    <p className="text-center text-xs text-slate-500 py-12 italic">
                      No chat messages in this case thread yet.
                    </p>
                  ) : (
                    chatMessages.map((m) => {
                      const isOfficer = m.senderRole === 'officer';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isOfficer ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-xl p-2.5 text-xs ${
                              isOfficer
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                            }`}
                          >
                            <div className="text-[10px] opacity-75 font-semibold mb-1">
                              {m.senderName} ({m.senderRole})
                            </div>
                            <p>{m.message}</p>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                            {new Date(m.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSendChat} className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder="Send instruction/update to citizen..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition"
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
