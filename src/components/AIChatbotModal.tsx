import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, ShieldAlert, PhoneCall, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

interface AIChatbotModalProps {
  onClose: () => void;
  onOpenComplaintForm: () => void;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({
  onClose,
  onOpenComplaintForm,
}) => {
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: `Namaste! I am CyberMitra, your AI Cyber Crime Advisor. 
How can I assist you today? You can ask about:
• What steps to take if you lost money in a UPI/Credit Card scam
• How to report fake social media profiles or cyber stalking
• Emergency Cyber Helpline **1930** filing guidelines
• How to preserve evidence and screenshots`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPrompt = async (promptToSend?: string) => {
    const query = promptToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await api.askAIChatbot(query);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Call National Cyber Crime Helpline **1930** immediately for emergency financial fraud lock down.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl h-[620px] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">CyberMitra AI Advisor</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                  Gemini AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Cyber Safety & Emergency Advisory AI
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
              <span className="text-[9px] text-slate-500 font-mono mt-1">{m.time}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-amber-300 bg-slate-950 border border-slate-800 p-3 rounded-2xl max-w-[70%]">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing cyber incident & fetching safety rules...</span>
            </div>
          )}
        </div>

        {/* Quick Sample Prompts */}
        <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
          <button
            onClick={() => handleSendPrompt('I lost money in a UPI QR code scam, what should I do?')}
            className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 px-3 py-1 rounded-full whitespace-nowrap"
          >
            🚨 UPI Scam Helpline 1930
          </button>
          <button
            onClick={() => handleSendPrompt('How do I report a fake Instagram profile?')}
            className="bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 px-3 py-1 rounded-full whitespace-nowrap"
          >
            📸 Fake Social Media Profile
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            placeholder="Ask AI Advisor about cyber crime laws, 1930 helpline, or scam recovery..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSendPrompt()}
            disabled={isLoading}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold p-2.5 rounded-xl transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
