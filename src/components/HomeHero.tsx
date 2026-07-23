import React from 'react';
import {
  ShieldAlert,
  FilePlus,
  Search,
  PhoneCall,
  Bot,
  CreditCard,
  Smartphone,
  Lock,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Users,
  ShieldCheck,
  TrendingUp,
  ChevronRight,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { CrimeCategory } from '../types';

interface HomeHeroProps {
  onOpenComplaintForm: () => void;
  onOpenTrackModal: () => void;
  onOpenAIChatbot: () => void;
  onSelectCategory: (category: CrimeCategory) => void;
  onSelectRoleView: (role: 'citizen' | 'officer' | 'admin') => void;
}

const FEATURED_CRIME_CATEGORIES: { name: CrimeCategory; desc: string; icon: string }[] = [
  { name: 'UPI Scam', desc: 'Money debited via QR code, fake refund link, or unauthorized PIN prompt.', icon: '💸' },
  { name: 'Online Fraud', desc: 'E-commerce website frauds, job scams, and lottery prize hoaxes.', icon: '🛒' },
  { name: 'Credit Card Fraud', desc: 'Unauthorized international transactions, card cloning, and CVV leaks.', icon: '💳' },
  { name: 'Identity Theft', desc: 'Impersonation using stolen Aadhaar, PAN, or cloned profile pictures.', icon: '🪪' },
  { name: 'Social Media Abuse', desc: 'Fake profiles, photo misuse, cyber stalking, and defamation.', icon: '📸' },
  { name: 'Phishing', desc: 'Deceptive bank SMS, electricity bill disconnection notices, and malware links.', icon: '🎣' },
  { name: 'Mobile App Fraud', desc: 'Unregistered loan apps, extortion threats, and unauthorized contacts scraping.', icon: '📱' },
  { name: 'Email Scam', desc: 'CEO impersonation, wire transfer fraud, and fake inheritance letters.', icon: '✉️' },
];

export const HomeHero: React.FC<HomeHeroProps> = ({
  onOpenComplaintForm,
  onOpenTrackModal,
  onOpenAIChatbot,
  onSelectCategory,
  onSelectRoleView,
}) => {
  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 py-8 text-[#E0E2E6]">
      {/* Main Hero Header */}
      <div className="relative overflow-hidden bg-[#0F1218] border border-white/10 rounded-sm p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-sm text-[10px] font-mono uppercase tracking-[0.2em]">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            NATIONAL CYBER COMMAND // MINISTRY OF HOME AFFAIRS
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-tight">
            REPORT CYBER CRIME<span className="text-blue-500">.</span> <br />
            <span className="text-blue-400 not-italic font-normal">
              SECURE FINANCIAL ASSETS IN REAL TIME.
            </span>
          </h1>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">
            A centralized citizen-centric incident command portal for financial frauds, online scams, identity theft, and cyber crimes with real-time status tracking and direct officer investigation desks.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenComplaintForm}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-[0.15em] px-6 py-3.5 rounded-sm shadow-xl transition"
            >
              <FilePlus className="w-4 h-4" />
              File Cyber Complaint
            </button>

            <button
              onClick={onOpenTrackModal}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs uppercase tracking-[0.15em] px-5 py-3.5 rounded-sm border border-white/10 transition"
            >
              <Search className="w-4 h-4 text-blue-400" />
              Track Status
            </button>

            <button
              onClick={onOpenAIChatbot}
              className="flex items-center gap-2 bg-[#06070a] hover:bg-white/5 text-blue-400 font-bold text-xs uppercase tracking-[0.15em] px-5 py-3.5 rounded-sm border border-blue-500/30 transition"
            >
              <Bot className="w-4 h-4 text-blue-400" />
              CyberMitra AI
            </button>
          </div>
        </div>

        {/* Floating stat pill overlay */}
        <div className="hidden lg:grid grid-cols-2 gap-4 absolute right-12 top-12 max-w-xs text-xs font-mono">
          <div className="bg-[#0A0C10]/90 border border-white/10 p-4 rounded-sm border-l-2 border-l-blue-500">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">GOLDEN HOUR FREEZE</div>
            <div className="text-xl font-bold text-white mt-1">1930 ACTIVE</div>
            <div className="text-[9px] text-blue-400 mt-0.5">DIRECT BANK ROUTE</div>
          </div>
          <div className="bg-[#0A0C10]/90 border border-white/10 p-4 rounded-sm border-l-2 border-l-rose-500">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">RESOLVED INCIDENTS</div>
            <div className="text-xl font-bold text-white mt-1">94.2%</div>
            <div className="text-[9px] text-rose-400 mt-0.5">NATIONAL AVERAGE</div>
          </div>
        </div>
      </div>

      {/* Emergency Golden Hour Advisory Banner */}
      <div className="bg-[#0F1218] border border-rose-500/40 rounded-sm p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-rose-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 rounded-sm">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-[0.2em]">
              EMERGENCY SCAM ADVISORY // GOLDEN HOUR PROTOCOL
            </div>
            <h3 className="text-lg md:text-xl font-black uppercase text-white mt-0.5">
              NATIONAL HELPLINE: <span className="text-rose-400 font-mono tracking-widest">1930</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              If you lost funds via UPI, OTP, or credit card within the last 2 hours, dial 1930 immediately to issue a bank account freeze across beneficiary nodes.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenComplaintForm}
          className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-sm shrink-0 transition"
        >
          Lodge 1930 Alert
        </button>
      </div>

      {/* Role Access Direct Portals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> Operational Portals
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase">// SELECT DESK</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => onSelectRoleView('citizen')}
            className="bg-[#0F1218] border border-white/10 hover:border-blue-500 p-6 rounded-sm cursor-pointer transition group space-y-3"
          >
            <div className="w-9 h-9 bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center rounded-sm group-hover:bg-blue-600 group-hover:text-white transition">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-blue-400 transition">
              Citizen Portal Desk
            </h4>
            <p className="text-xs text-slate-400">
              Lodge complaints, upload evidence screenshots, track investigation progress, and chat directly with assigned officers.
            </p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition pt-1">
              Enter Citizen Desk <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => onSelectRoleView('officer')}
            className="bg-[#0F1218] border border-white/10 hover:border-blue-500 p-6 rounded-sm cursor-pointer transition group space-y-3"
          >
            <div className="w-9 h-9 bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center rounded-sm group-hover:bg-blue-600 group-hover:text-white transition">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-blue-400 transition">
              Cyber Crime Officer Desk
            </h4>
            <p className="text-xs text-slate-400">
              Review assigned cases, update investigation statuses, record Section 91 CrPC bank notices, and issue disposition reports.
            </p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition pt-1">
              Enter Officer Desk <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => onSelectRoleView('admin')}
            className="bg-[#0F1218] border border-white/10 hover:border-rose-500 p-6 rounded-sm cursor-pointer transition group space-y-3"
          >
            <div className="w-9 h-9 bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center rounded-sm group-hover:bg-rose-600 group-hover:text-white transition">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-rose-400 transition">
              Directorate Admin Panel
            </h4>
            <p className="text-xs text-slate-400">
              Executive dashboard, crime distribution analytics, officer workload allocation, user blocking, and PDF report downloads.
            </p>
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 flex items-center gap-1 group-hover:translate-x-1 transition pt-1">
              Enter Directorate Control <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Cyber Crime Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" /> Incident Categories // Direct Lodge
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase">8 CLASSIFICATIONS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_CRIME_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              onClick={() => {
                onSelectCategory(cat.name);
                onOpenComplaintForm();
              }}
              className="bg-[#0F1218] border border-white/10 hover:border-blue-500/60 p-4 rounded-sm cursor-pointer transition group space-y-2 hover:bg-white/5"
            >
              <div className="text-2xl">{cat.icon}</div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-blue-400 transition">
                {cat.name}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
