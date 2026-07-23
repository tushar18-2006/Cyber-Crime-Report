import React, { useState } from 'react';
import { User, ShieldCheck, Users, X, Lock, Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User as UserType, Role } from '../types';
import { api } from '../services/api';

interface LoginRegisterModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const LoginRegisterModal: React.FC<LoginRegisterModalProps> = ({
  onClose,
  onLoginSuccess,
}) => {
  const [activeRole, setActiveRole] = useState<Role>('citizen');
  const [email, setEmail] = useState('aarav.mehta@example.com');
  const [isRegistering, setIsRegistering] = useState(false);

  // Register Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoAutofill = (role: Role) => {
    setActiveRole(role);
    if (role === 'citizen') {
      setEmail('aarav.mehta@example.com');
    } else if (role === 'officer') {
      setEmail('vikram.singh@cybercrime.gov.in');
    } else if (role === 'admin') {
      setEmail('admin@cybercrime.gov.in');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        const res = await api.register({
          name,
          email,
          phone: phone || '+91 98765 43210',
          role: activeRole,
        });
        onLoginSuccess(res.user);
      } else {
        const res = await api.login(email, activeRole);
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0F1218] border border-white/10 rounded-sm shadow-2xl w-full max-w-md overflow-hidden text-slate-100 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white italic">
              {isRegistering ? 'CREATE PORTAL ACCESS' : 'PORTAL SECURE TERMINAL'}
            </h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
              National Cyber Command • MHA
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-sm border border-white/10 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#0A0C10] p-1 rounded-sm border border-white/10 text-xs font-mono uppercase tracking-widest">
          <button
            type="button"
            onClick={() => handleDemoAutofill('citizen')}
            className={`py-2 rounded-sm transition flex items-center justify-center gap-1.5 font-bold ${
              activeRole === 'citizen' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Citizen
          </button>

          <button
            type="button"
            onClick={() => handleDemoAutofill('officer')}
            className={`py-2 rounded-sm transition flex items-center justify-center gap-1.5 font-bold ${
              activeRole === 'officer' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Officer
          </button>

          <button
            type="button"
            onClick={() => handleDemoAutofill('admin')}
            className={`py-2 rounded-sm transition flex items-center justify-center gap-1.5 font-bold ${
              activeRole === 'admin' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Admin
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-sm text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegistering && (
            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase tracking-widest mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Mehta"
                className="w-full bg-[#0A0C10] border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-mono text-[10px] uppercase tracking-widest mb-1">Email Identifier</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              className="w-full bg-[#0A0C10] border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase tracking-widest mb-1">Mobile Number (+91)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-[#0A0C10] border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-mono text-[10px] uppercase tracking-widest mb-1">Passcode</label>
            <input
              type="password"
              defaultValue="password123"
              className="w-full bg-[#0A0C10] border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Quick Demo Pre-fills */}
          <div className="p-3 bg-[#0A0C10] rounded-sm border border-white/10 text-[11px] text-slate-400 space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-300">⚡ QUICK DEMO CREDENTIALS:</p>
            <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => handleDemoAutofill('citizen')}
                className="bg-[#0F1218] border border-white/10 px-2 py-1 rounded-sm text-blue-400 hover:border-blue-500 transition uppercase"
              >
                Citizen (Aarav)
              </button>
              <button
                type="button"
                onClick={() => handleDemoAutofill('officer')}
                className="bg-[#0F1218] border border-white/10 px-2 py-1 rounded-sm text-emerald-400 hover:border-emerald-500 transition uppercase"
              >
                Officer (Vikram)
              </button>
              <button
                type="button"
                onClick={() => handleDemoAutofill('admin')}
                className="bg-[#0F1218] border border-white/10 px-2 py-1 rounded-sm text-rose-400 hover:border-rose-500 transition uppercase"
              >
                Admin (Director)
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider py-2.5 rounded-sm transition shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? 'AUTHENTICATING...' : isRegistering ? 'REGISTER ACCOUNT' : 'AUTHENTICATE NOW'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10 font-mono">
          {isRegistering ? 'Already registered?' : "Need an account?"}{' '}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-400 font-bold uppercase underline hover:text-blue-300"
          >
            {isRegistering ? 'Sign In' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
