import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { DashboardStats } from '../types';
import { StatCard } from '../components/StatCard';
import { Users, FolderKanban, CheckSquare, DollarSign, Clock, TrendingUp, PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/company/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f43f5e'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Executive Control Center</h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">Real-time tenant performance & business analytics</p>
      </div>

      {/* Business Health Score Widget */}
      {stats?.healthScore && (
        <div className="glass-panel p-6 bg-gradient-to-r from-indigo-900/40 to-slate-900/60 border-l-4 border-l-indigo-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-slate-800 border-4 border-indigo-500/30">
                <span className="text-3xl font-black text-white">{stats.healthScore.overall}</span>
                <span className="absolute -bottom-2 bg-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full text-white">HEALTH</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Business Health Score</h2>
                <p className="text-sm text-slate-400 max-w-md mt-1">This composite metric tracks overall operational vitality based on finance, project completion, people utilization, and operational efficiency.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="bg-slate-800/50 p-3 rounded-lg text-center border border-slate-700">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Finance</div>
                <div className={`text-xl font-bold ${stats.healthScore.subScores.finance < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>{stats.healthScore.subScores.finance}/100</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg text-center border border-slate-700">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Projects</div>
                <div className={`text-xl font-bold ${stats.healthScore.subScores.project < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{stats.healthScore.subScores.project}/100</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg text-center border border-slate-700">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">People</div>
                <div className={`text-xl font-bold ${stats.healthScore.subScores.people < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>{stats.healthScore.subScores.people}/100</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg text-center border border-slate-700">
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Operations</div>
                <div className={`text-xl font-bold ${stats.healthScore.subScores.operations < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{stats.healthScore.subScores.operations}/100</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards Row (FR-6.1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Employees"
          value={stats?.cards.totalEmployees || 0}
          icon={Users}
          badgeText="Active Roster"
          color="indigo"
        />
        <StatCard
          title="Active Projects"
          value={stats?.cards.totalProjects || 0}
          icon={FolderKanban}
          badgeText="In Pipeline"
          color="cyan"
        />
        <StatCard
          title="Active Tasks"
          value={stats?.cards.activeTasks || 0}
          icon={CheckSquare}
          badgeText="Pending Review"
          color="amber"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats?.cards.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          trend="+12.4% vs last month"
          color="emerald"
        />
        <StatCard
          title="Pending Receivables"
          value={`$${(stats?.cards.pendingPayments || 0).toLocaleString()}`}
          icon={Clock}
          badgeText="Invoices Due"
          color="rose"
        />
      </div>

      {/* Visual Analytics Charts Grid (FR-6.2, FR-6.3, FR-6.4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Area Chart */}
        <div className="glass-panel p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Revenue Trend Timeline</h2>
            </div>
            <span className="badge badge-purple">Monthly USD</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.charts.revenueChart || []}>
                <defs>
                  <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="paid" name="Collected Paid" stroke="#6366f1" fillOpacity={1} fill="url(#paidGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="pending" name="Pending Receivables" stroke="#f59e0b" fillOpacity={1} fill="url(#pendingGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Pie Chart */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Project Status Distribution</h2>
            </div>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.charts.projectStatusChart || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.charts.projectStatusChart || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Employee Workload Distribution (FR-6.4) */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Active Employee Workload Load</h2>
          </div>
          <span className="badge badge-green">Tasks Assigned</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.charts.employeeWorkloadChart || []}>
              <XAxis dataKey="employeeName" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
              <Bar dataKey="taskCount" name="Active Tasks" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
