import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  AlertCircle,
  X,
  Printer,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';

interface PublicTrackerProps {
  onClose?: () => void;
  initialAckNumber?: string;
}

export const PublicTracker: React.FC<PublicTrackerProps> = ({
  onClose,
  initialAckNumber = '',
}) => {
  const [ackNumber, setAckNumber] = useState(initialAckNumber);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ackNumber.trim()) {
      setError('Please enter a valid Acknowledgement Number.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await api.trackComplaint(ackNumber.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Complaint not found. Check number and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 max-w-2xl mx-auto my-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Track Complaint Status Online</h3>
            <p className="text-xs text-slate-400">
              Enter Acknowledgement Number (e.g. CYBER-2026-8912)
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleTrack} className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={ackNumber}
            onChange={(e) => setAckNumber(e.target.value)}
            placeholder="CYBER-2026-XXXX"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm font-mono text-indigo-300 font-bold focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track Status'}
        </button>
      </form>

      {error && (
        <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          {error}
        </div>
      )}

      {result && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase">
                Acknowledgement Ref
              </span>
              <h4 className="text-lg font-mono font-bold text-indigo-400">{result.ackNumber}</h4>
              <p className="text-xs text-slate-300 font-medium mt-0.5">{result.title}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Current Status</span>
              <div>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                  {result.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Crime Category</span>
              <span className="font-semibold text-slate-200">{result.category}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Assigned Investigator</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {result.assignedOfficerName}
              </span>
            </div>
          </div>

          {/* Timeline Tracker */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Investigation Lifecycle Timeline
            </h5>

            <div className="space-y-2">
              {result.timeline.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs transition ${
                    item.completed
                      ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <div className="flex-1">
                    <span className="font-semibold">{item.step}</span>
                  </div>
                  {item.timestamp && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-lg border border-slate-700 font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print Status Slip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
