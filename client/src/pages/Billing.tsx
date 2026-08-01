import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Check, ShieldCheck, Zap, Sparkles, AlertCircle } from 'lucide-react';

interface SubData {
  subscription: {
    plan: string;
    status: string;
    seatLimit: number;
    projectLimit: number;
    aiQueryLimit: number;
    currentPeriodEnd: string;
  };
  usage: {
    usedSeats: number;
    usedProjects: number;
    usedAiQueries: number;
  };
}

export const Billing: React.FC = () => {
  const [subData, setSubData] = useState<SubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [message, setMessage] = useState('');

  const { user } = useAuth();

  const fetchBilling = async () => {
    try {
      const res = await api.get('/platform/billing');
      setSubData(res.data);
    } catch (err) {
      console.error('Error loading billing info', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const handleUpgradePlan = async (planTier: string) => {
    setUpgrading(true);
    setMessage('');
    try {
      const res = await api.post('/platform/billing/upgrade', { plan: planTier });
      setMessage(res.data.message);
      fetchBilling();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error processing plan upgrade');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentPlan = subData?.subscription.plan || 'Free Trial';
  const seatsUsed = subData?.usage.usedSeats || 0;
  const seatLimit = subData?.subscription.seatLimit || 5;

  const projectsUsed = subData?.usage.usedProjects || 0;
  const projectLimit = subData?.subscription.projectLimit || 10;

  const aiUsed = subData?.usage.usedAiQueries || 0;
  const aiLimit = subData?.subscription.aiQueryLimit || 50;

  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/month',
      description: 'Ideal for small growing teams and startups.',
      seats: '10 Employee Seats',
      projects: '25 Active Projects',
      aiQueries: '200 AI COO Queries / mo',
      color: 'indigo'
    },
    {
      name: 'Business',
      price: '$199',
      period: '/month',
      description: 'Full capabilities for scaling mid-market enterprises.',
      seats: '50 Employee Seats',
      projects: '100 Active Projects',
      aiQueries: '1,000 AI COO Queries / mo',
      color: 'violet',
      featured: true
    },
    {
      name: 'Enterprise',
      price: '$499',
      period: '/month',
      description: 'Unlimited scale with dedicated SOC2 & SLA support.',
      seats: 'Unlimited Seats',
      projects: 'Unlimited Projects',
      aiQueries: 'Unlimited AI COO Queries',
      color: 'cyan'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Subscription Engine</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Manage tenant subscription tier, billing status & resource quotas</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Active Plan: {currentPlan}
          </span>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Quota Usage Meters */}
      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          <span>Active Resource Quota Meters</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Seat Quota */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[var(--text-muted)]">Employee Seats</span>
              <span className="text-white">{seatsUsed} / {seatLimit >= 999 ? '∞' : seatLimit}</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${seatsUsed >= seatLimit ? 'bg-rose-500' : 'bg-indigo-500'}`}
                style={{ width: `${Math.min(100, (seatsUsed / (seatLimit >= 999 ? 100 : seatLimit)) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Project Quota */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[var(--text-muted)]">Active Projects</span>
              <span className="text-white">{projectsUsed} / {projectLimit >= 999 ? '∞' : projectLimit}</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${projectsUsed >= projectLimit ? 'bg-rose-500' : 'bg-cyan-500'}`}
                style={{ width: `${Math.min(100, (projectsUsed / (projectLimit >= 999 ? 100 : projectLimit)) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* AI Query Quota */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[var(--text-muted)]">AI COO Queries</span>
              <span className="text-white">{aiUsed} / {aiLimit >= 9999 ? '∞' : aiLimit}</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 transition-all"
                style={{ width: `${Math.min(100, (aiUsed / (aiLimit >= 9999 ? 100 : aiLimit)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((p) => {
          const isCurrent = currentPlan.toLowerCase() === p.name.toLowerCase();
          return (
            <div
              key={p.name}
              className={`glass-panel p-6 relative flex flex-col justify-between space-y-6 ${
                p.featured ? 'border-indigo-500/60 shadow-xl shadow-indigo-500/10' : ''
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">{p.description}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-[var(--text-muted)]">{p.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 mt-4 border-t border-[var(--border-color)] text-xs text-white">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{p.seats}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{p.projects}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{p.aiQueries}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Role-Based Access Control</span>
                  </div>
                </div>
              </div>

              <div>
                {isCurrent ? (
                  <button disabled className="btn-secondary w-full justify-center opacity-60 cursor-not-allowed">
                    Current Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgradePlan(p.name)}
                    disabled={upgrading}
                    className="btn-primary w-full justify-center"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{upgrading ? 'Upgrading...' : `Upgrade to ${p.name}`}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
