import React, { useState } from 'react';
import {
  ShieldAlert,
  FilePlus,
  Search,
  Bot,
  User,
  Bell,
  LogOut,
  PhoneCall,
  Lock,
  ChevronDown,
  CheckCircle2,
  Users,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { User as UserType, NotificationItem } from '../types';

interface NavbarProps {
  currentUser: UserType | null;
  onSelectRole: (role: 'citizen' | 'officer' | 'admin') => void;
  onOpenAuthModal: () => void;
  onOpenComplaintForm: () => void;
  onOpenTrackModal: () => void;
  onOpenAIChatbot: () => void;
  activeTab: 'citizen' | 'officer' | 'admin' | 'home';
  setActiveTab: (tab: 'citizen' | 'officer' | 'admin' | 'home') => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuthModal,
  onOpenComplaintForm,
  onOpenTrackModal,
  onOpenAIChatbot,
  activeTab,
  setActiveTab,
  notifications,
  onMarkNotificationRead,
  onLogout,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0A0C10] text-[#E0E2E6] shadow-2xl border-b border-white/10 backdrop-blur-md">
      {/* Top Emergency Helpline Ticker */}
      <div className="bg-[#06070a] border-b border-white/10 px-4 py-1.5 text-xs text-slate-300 font-sans">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono font-bold px-2 py-0.5 rounded-sm text-[10px] tracking-wider uppercase animate-pulse">
              <PhoneCall className="w-3 h-3" />
              EMERGENCY 1930
            </span>
            <span className="font-semibold text-slate-200 text-xs">
              National Cyber Helpline: <strong className="text-blue-400 font-mono tracking-widest text-sm">1930</strong>
            </span>
            <span className="hidden md:inline text-[11px] text-slate-400 uppercase tracking-wider">
              // Immediate Bank Freeze Protocol (Golden Hour)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest">
              <Lock className="w-3 h-3 text-blue-400" /> SECURE NODE 256-BIT
            </span>
            <button
              onClick={onOpenAIChatbot}
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-[11px] font-mono tracking-wider transition uppercase"
            >
              <Bot className="w-3.5 h-3.5" /> CyberMitra AI
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand Header */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Logo and Ministry Title */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 rounded-sm group-hover:bg-blue-600 group-hover:text-white transition">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black italic tracking-tighter uppercase text-white group-hover:text-blue-400 transition">
                CCRP<span className="text-blue-500 text-lg">.</span>
              </h1>
              <span className="text-[9px] uppercase tracking-[0.2em] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-sm font-mono">
                National Command
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
              Cyber Crime Reporting Portal // MHA
            </p>
          </div>
        </div>

        {/* Central Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onOpenComplaintForm}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px] uppercase tracking-[0.15em] px-4 py-2.5 rounded-sm shadow-lg transition"
          >
            <FilePlus className="w-4 h-4" />
            File Complaint
          </button>

          <button
            onClick={onOpenTrackModal}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2.5 rounded-sm border border-white/10 transition"
          >
            <Search className="w-4 h-4 text-blue-400" />
            Track Status
          </button>
        </div>

        {/* Role Switcher & User Profile Menu */}
        <div className="flex items-center gap-3">
          {/* Notifications dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-sm bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0F1218] border border-white/10 rounded-sm shadow-2xl z-50 overflow-hidden text-xs">
                <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-300">System Feed</span>
                  <span className="text-[10px] font-mono text-blue-400">
                    {unreadCount} Unread
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500 font-mono">
                      No live notifications.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => onMarkNotificationRead(n.id)}
                        className={`p-3 cursor-pointer hover:bg-white/5 transition ${
                          !n.isRead ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-xs text-slate-200 uppercase tracking-tight">{n.title}</p>
                          <span className="text-[9px] font-mono text-slate-500">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current User & Role Selector */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 px-3 py-1.5 rounded-sm transition text-xs"
              >
                <div className="w-5 h-5 rounded-sm bg-blue-500 text-black font-black flex items-center justify-center text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-bold uppercase tracking-tight text-slate-200 text-[11px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-blue-400 font-mono">
                    [{currentUser.role}]
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0F1218] border border-white/10 rounded-sm shadow-2xl z-50 p-2 text-xs">
                  <div className="p-2 border-b border-white/10 mb-1">
                    <p className="font-bold text-slate-200 uppercase tracking-tight">{currentUser.name}</p>
                    <p className="text-slate-400 text-[10px] font-mono truncate">{currentUser.email}</p>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('citizen');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-left font-bold uppercase text-[10px] tracking-wider transition ${
                        activeTab === 'citizen' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" /> Citizen Desk
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('officer');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-left font-bold uppercase text-[10px] tracking-wider transition ${
                        activeTab === 'officer' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Investigator Desk
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-left font-bold uppercase text-[10px] tracking-wider transition ${
                        activeTab === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" /> Directorate Control
                    </button>
                  </div>

                  <div className="border-t border-white/10 mt-2 pt-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setShowRoleDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-sm text-left font-bold uppercase text-[10px] tracking-wider transition"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Terminate Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-sm transition"
            >
              <User className="w-3.5 h-3.5" /> Access Portal
            </button>
          )}
        </div>
      </div>

      {/* Role Navigation Tabs Bar */}
      <div className="bg-[#07080c] border-t border-white/10 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-5 py-2.5 border-b-2 font-bold uppercase text-[10px] tracking-[0.2em] transition ${
                activeTab === 'home'
                  ? 'border-blue-500 text-blue-400 bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('citizen')}
              className={`px-5 py-2.5 border-b-2 font-bold uppercase text-[10px] tracking-[0.2em] transition flex items-center gap-2 ${
                activeTab === 'citizen'
                  ? 'border-blue-500 text-blue-400 bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Citizen Desk
            </button>

            <button
              onClick={() => setActiveTab('officer')}
              className={`px-5 py-2.5 border-b-2 font-bold uppercase text-[10px] tracking-[0.2em] transition flex items-center gap-2 ${
                activeTab === 'officer'
                  ? 'border-blue-500 text-blue-400 bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Officer Investigation Desk
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-5 py-2.5 border-b-2 font-bold uppercase text-[10px] tracking-[0.2em] transition flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'border-blue-500 text-blue-400 bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Directorate Admin
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-400 text-[10px] font-mono tracking-widest uppercase py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
            LIVE NODE // GMT+5:30
          </div>
        </div>
      </div>
    </header>
  );
};
