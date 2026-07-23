import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldAlert,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart3,
  UserPlus,
  Lock,
  Unlock,
  Printer,
  Download,
  Search,
  ShieldCheck,
  Activity,
  FileCheck,
  X,
  User,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { AdminStats, User as UserType, Complaint, ActivityLog } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  currentUser: UserType;
  complaints: Complaint[];
  onRefreshData: () => void;
}

const COLORS = [
  '#6366f1',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  complaints,
  onRefreshData,
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'complaints' | 'users' | 'logs'>('analytics');

  // Assign Officer Modal State
  const [assignModalComplaint, setAssignModalComplaint] = useState<Complaint | null>(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>('');

  // Register Officer Modal
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerEmail, setNewOfficerEmail] = useState('');
  const [newOfficerPhone, setNewOfficerPhone] = useState('');
  const [newOfficerBadge, setNewOfficerBadge] = useState('');
  const [newOfficerDept, setNewOfficerDept] = useState('Financial Crime Cell');

  useEffect(() => {
    loadAdminData();
  }, [complaints]);

  const loadAdminData = async () => {
    try {
      const s = await api.getAdminStats();
      const u = await api.getUsers();
      const l = await api.getActivityLogs();
      setStats(s);
      setUsers(u);
      setActivityLogs(l);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBlockUser = async (userId: string, currentBlocked: boolean) => {
    try {
      await api.blockUser(userId, !currentBlocked, currentUser);
      loadAdminData();
    } catch (err) {
      alert('Failed to block/unblock user');
    }
  };

  const handleAssignOfficerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalComplaint || !selectedOfficerId) return;

    try {
      const off = users.find((u) => u.id === selectedOfficerId);
      await api.assignOfficer(assignModalComplaint.id, selectedOfficerId, off?.name, currentUser);
      setAssignModalComplaint(null);
      onRefreshData();
      loadAdminData();
    } catch (err) {
      alert('Failed to assign officer');
    }
  };

  const handleRegisterOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName || !newOfficerEmail) return;

    try {
      await api.register({
        name: newOfficerName,
        email: newOfficerEmail,
        phone: newOfficerPhone || '+91 98000 00000',
        role: 'officer',
        badgeNumber: newOfficerBadge || `CYBER-OFF-${Math.floor(100 + Math.random() * 900)}`,
        department: newOfficerDept,
      });

      setShowAddOfficerModal(false);
      setNewOfficerName('');
      setNewOfficerEmail('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to register officer');
    }
  };

  const officers = users.filter((u) => u.role === 'officer');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 text-[#E0E2E6]">
      {/* Admin Header Banner */}
      <div className="bg-[#0F1218] border border-white/10 rounded-sm p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-rose-500">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-sm">
              DIRECTORATE ADMIN CONTROL PANEL
            </span>
            <span className="text-[11px] text-slate-400 font-mono">// NATIONAL COMMAND</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white mt-1">
            {currentUser.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Supervise national cyber crime reports, allocate officer workloads, manage citizen access, and export intelligence reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddOfficerModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-sm shadow-lg transition"
          >
            <UserPlus className="w-4 h-4" /> Add Officer
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-sm border border-white/10 transition"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
        </div>
      </div>

      {/* Top Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#0F1218] border border-white/10 rounded-sm p-4 border-l-2 border-l-blue-500 shadow-md">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">TOTAL COMPLAINTS</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {stats?.totalComplaints || complaints.length}
          </div>
          <span className="text-[9px] text-blue-400 font-mono uppercase">100% INGESTION</span>
        </div>

        <div className="bg-[#0F1218] border border-white/10 rounded-sm p-4 border-l-2 border-l-emerald-500 shadow-md">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">SOLVED CASES</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {stats?.solvedCases || 0}
          </div>
          <span className="text-[9px] text-emerald-400 font-mono uppercase">DISPOSITION ISSUED</span>
        </div>

        <div className="bg-[#0F1218] border border-white/10 rounded-sm p-4 border-l-2 border-l-amber-500 shadow-md">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">PENDING QUEUE</div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
            {stats?.pendingCases || 0}
          </div>
          <span className="text-[9px] text-amber-400 font-mono uppercase">UNDER REVIEW</span>
        </div>

        <div className="bg-[#0F1218] border border-white/10 rounded-sm p-4 border-l-2 border-l-rose-500 shadow-md">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">FINANCIAL LOSS</div>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
            ₹{(stats?.totalFinancialLoss || 0).toLocaleString()}
          </div>
          <span className="text-[9px] text-rose-400 font-mono uppercase">BANK FREEZE ACTIVE</span>
        </div>

        <div className="bg-[#0F1218] border border-white/10 rounded-sm p-4 border-l-2 border-l-blue-400 shadow-md">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">ACTIVE OFFICERS</div>
          <div className="text-2xl font-bold text-blue-300 font-mono mt-1">
            {officers.length}
          </div>
          <span className="text-[9px] text-blue-400 font-mono uppercase">DEPLOYED SQUAD</span>
        </div>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 text-xs font-mono uppercase tracking-widest">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`pb-2.5 px-4 border-b-2 transition font-bold ${
            activeSubTab === 'analytics'
              ? 'border-blue-500 text-blue-400 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Intelligence Analytics
        </button>

        <button
          onClick={() => setActiveSubTab('complaints')}
          className={`pb-2.5 px-4 border-b-2 transition font-bold ${
            activeSubTab === 'complaints'
              ? 'border-blue-500 text-blue-400 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Incident Queue & Allocation
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`pb-2.5 px-4 border-b-2 transition font-bold ${
            activeSubTab === 'users'
              ? 'border-blue-500 text-blue-400 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Users & Squad ({users.length})
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`pb-2.5 px-4 border-b-2 transition font-bold ${
            activeSubTab === 'logs'
              ? 'border-blue-500 text-blue-400 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Audit Terminal ({activityLogs.length})
        </button>
      </div>

      {/* SUB-TAB 1: Analytics & Charts */}
      {activeSubTab === 'analytics' && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Crime Category Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Crime Categories Breakdown
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Monthly Incident Filing vs Solved Trends */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Monthly Cyber Incident Trends
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="filed" stroke="#ef4444" strokeWidth={2} name="Filed Cases" />
                  <Line type="monotone" dataKey="solved" stroke="#10b981" strokeWidth={2} name="Solved Cases" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Officer Workload & Performance Table */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Officer Workload & Resolution Efficiency
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Badge & Officer Name</th>
                    <th className="p-3">Assigned Cases</th>
                    <th className="p-3">Solved Cases</th>
                    <th className="p-3">Avg Resolution Time</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {stats.officerPerformance.map((off) => (
                    <tr key={off.officerId} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white flex items-center gap-2">
                        <span className="font-mono text-indigo-400 text-[10px] bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800">
                          {off.badgeNumber}
                        </span>
                        {off.name}
                      </td>
                      <td className="p-3 font-mono text-slate-200">{off.assignedCount} Cases</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">{off.solvedCount} Solved</td>
                      <td className="p-3 font-mono text-slate-300">{off.avgResolutionDays} Days</td>
                      <td className="p-3">
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          Active Squad
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: All Complaints & Officer Assignment */}
      {activeSubTab === 'complaints' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">All Master Complaint Queue ({complaints.length})</h3>
          </div>

          <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
            {complaints.map((c) => (
              <div key={c.id} className="p-4 hover:bg-slate-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-400 text-xs bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      {c.ackNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">{c.category}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {c.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">{c.title}</h4>
                  <p className="text-xs text-slate-400">
                    Complainant: {c.complainantName} • Assigned Officer: <strong className="text-emerald-400">{c.assignedOfficerName || 'Unassigned'}</strong>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setAssignModalComplaint(c);
                    setSelectedOfficerId(c.assignedOfficerId || officers[0]?.id || '');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shrink-0 transition"
                >
                  Assign / Reassign Officer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Manage Users & Officers */}
      {activeSubTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">User Accounts & Access Control</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">User Name & Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-slate-400 text-[11px]">{u.email}</div>
                    </td>
                    <td className="p-3 font-mono">{u.phone}</td>
                    <td className="p-3 capitalize font-semibold text-indigo-400">{u.role}</td>
                    <td className="p-3">
                      {u.isBlocked ? (
                        <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] px-2 py-0.5 rounded font-bold">
                          Blocked / Suspended
                        </span>
                      ) : (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                          Active Authorized
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleBlockUser(u.id, !!u.isBlocked)}
                          className={`text-xs px-3 py-1 rounded-lg border font-semibold transition ${
                            u.isBlocked
                              ? 'bg-emerald-950 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                              : 'bg-rose-950 border-rose-800 text-rose-300 hover:bg-rose-900'
                          }`}
                        >
                          {u.isBlocked ? 'Unblock' : 'Block Account'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: System Audit Logs */}
      {activeSubTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" /> Security Audit & Action Logs
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto font-mono text-xs">
            {activityLogs.map((log) => (
              <div key={log.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold text-indigo-400">{log.actorName} ({log.actorRole})</span>
                    <span className="text-slate-500">• IP: {log.ipAddress}</span>
                  </div>
                  <p className="font-semibold text-slate-200 mt-0.5">{log.action}</p>
                  <p className="text-slate-400 text-[11px] font-sans">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign Officer Modal */}
      {assignModalComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Assign Investigator to Case</h3>
              <button onClick={() => setAssignModalComplaint(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select officer to assign for <strong className="text-indigo-400">{assignModalComplaint.ackNumber}</strong> ({assignModalComplaint.category}).
            </p>

            <form onSubmit={handleAssignOfficerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Officer</label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                >
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.badgeNumber || 'Officer'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalComplaint(null)}
                  className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Cyber Crime Officer Modal */}
      {showAddOfficerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Register Cyber Crime Officer</h3>
              <button onClick={() => setShowAddOfficerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterOfficer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Officer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newOfficerName}
                  onChange={(e) => setNewOfficerName(e.target.value)}
                  placeholder="Inspector Rajesh Verma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Govt Email *</label>
                <input
                  type="email"
                  required
                  value={newOfficerEmail}
                  onChange={(e) => setNewOfficerEmail(e.target.value)}
                  placeholder="rajesh.verma@cybercrime.gov.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Number</label>
                <input
                  type="text"
                  value={newOfficerBadge}
                  onChange={(e) => setNewOfficerBadge(e.target.value)}
                  placeholder="CYBER-OFF-901"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department Cell</label>
                <select
                  value={newOfficerDept}
                  onChange={(e) => setNewOfficerDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                >
                  <option value="Financial Crime Cell">Financial Crime Cell</option>
                  <option value="Identity & Cyber Bullying Squad">Identity & Cyber Bullying Squad</option>
                  <option value="Malware & Hacking Unit">Malware & Hacking Unit</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOfficerModal(false)}
                  className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg"
                >
                  Create Officer Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
