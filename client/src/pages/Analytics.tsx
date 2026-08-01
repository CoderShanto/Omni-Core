import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { AnalyticsData } from '../types';
import { BarChart3, CheckCircle2, Clock, Users, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/company/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const taskPieData = [
    { name: 'Completed On-Time', value: data?.taskPerformance.completedOnTime || 0, color: '#10b981' },
    { name: 'Active On-Time', value: data?.taskPerformance.onTimeActive || 0, color: '#6366f1' },
    { name: 'Overdue Tasks', value: data?.taskPerformance.overdue || 0, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Business Intelligence & Analytics</h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">Calculated operational efficiency metrics & sprint performance tracking</p>
      </div>

      {/* Grid of Key Analytical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* FR-7.1 Project Completion Rate */}
        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] uppercase">
            <span>Project Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white">{data?.projectCompletion.completionRate}%</h3>
          <p className="text-xs text-[var(--text-muted)]">
            {data?.projectCompletion.completedProjects} of {data?.projectCompletion.totalProjects} total projects completed
          </p>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-400 h-full transition-all" style={{ width: `${data?.projectCompletion.completionRate}%` }}></div>
          </div>
        </div>

        {/* FR-7.2 Employee Utilization */}
        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] uppercase">
            <span>Employee Utilization</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white">{data?.employeeUtilization.avgTaskPerEmployee}</h3>
          <p className="text-xs text-[var(--text-muted)]">
            Avg active tasks load per employee across {data?.employeeUtilization.totalEmployees} staff
          </p>
        </div>

        {/* FR-7.4 Task Overdue Rate */}
        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] uppercase">
            <span>Task Slippage Rate</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-rose-400">{data?.taskPerformance.overduePercentage}%</h3>
          <p className="text-xs text-[var(--text-muted)]">
            {data?.taskPerformance.overdue} task(s) currently overdue deadline
          </p>
        </div>

        {/* Financial Realization */}
        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] uppercase">
            <span>Paid Revenue Realization</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-emerald-400">
            ${(data?.financialSummary.paidTotal || 0).toLocaleString()}
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Pending: ${(data?.financialSummary.pendingTotal || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Task Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Task Delivery Performance</h2>
            <span className="badge badge-purple">On-time vs Overdue</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Insights List */}
        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>BI Efficiency Insights</span>
          </h2>

          <div className="space-y-3 text-xs text-[var(--text-muted)]">
            <div className="p-3.5 rounded-xl bg-white/5 border border-[var(--border-color)]">
              <strong className="text-white block mb-1">Project Delivery Rate:</strong>
              Your tenant has successfully completed {data?.projectCompletion.completedProjects} out of {data?.projectCompletion.totalProjects} total projects ({data?.projectCompletion.completionRate}% completion rate).
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-[var(--border-color)]">
              <strong className="text-white block mb-1">Task Pipeline Health:</strong>
              {data?.taskPerformance.overdue === 0 ? (
                <span className="text-emerald-400">Excellent! Zero task deadlines are currently overdue.</span>
              ) : (
                <span className="text-amber-400">Attention needed: {data?.taskPerformance.overdue} tasks require manager intervention due to overdue deadlines.</span>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-[var(--border-color)]">
              <strong className="text-white block mb-1">Cash Flow Health:</strong>
              Total paid collections equal ${(data?.financialSummary.paidTotal || 0).toLocaleString()}, with ${(data?.financialSummary.pendingTotal || 0).toLocaleString()} awaiting payment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
