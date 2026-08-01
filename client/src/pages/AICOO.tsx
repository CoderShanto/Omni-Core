import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ProjectRiskReport, RevenueForecast } from '../types';
import { Bot, Send, AlertTriangle, TrendingUp, Sparkles, ShieldAlert, CheckCircle2, HelpCircle, DollarSign, Users } from 'lucide-react';

export const AICOO: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'risks' | 'forecast' | 'leaks' | 'burnout'>('assistant');
  
  // Natural query state
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; insights?: string[]; category?: string }>>([
    {
      sender: 'ai',
      text: 'Greetings, Executive. I am your AI COO assistant. How can I assist with tenant operations, project risks, or financial forecasting today?',
      insights: [
        'Try asking: "What should I focus on today?"',
        'Try asking: "What is our financial revenue outlook?"',
        'Try asking: "How is our employee workload distribution?"'
      ]
    }
  ]);
  const [queryLoading, setQueryLoading] = useState(false);

  // Risk reports & forecast state
  const [risks, setRisks] = useState<ProjectRiskReport[]>([]);
  const [forecast, setForecast] = useState<RevenueForecast | null>(null);
  const [leaks, setLeaks] = useState<any>(null);
  const [burnout, setBurnout] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        const [riskRes, forecastRes, leaksRes, burnoutRes] = await Promise.all([
          api.get('/ai/risk-analysis'),
          api.get('/ai/revenue-forecast'),
          api.get('/ai/revenue-leaks'),
          api.get('/ai/workload-burnout')
        ]);
        setRisks(riskRes.data.reports || []);
        setForecast(forecastRes.data.forecast || null);
        setLeaks(leaksRes.data.leaks || null);
        setBurnout(burnoutRes.data.burnoutReport || []);
      } catch (err) {
        console.error('Error loading AI COO models', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAIData();
  }, []);

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setQuery('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setQueryLoading(true);

    try {
      const res = await api.post('/ai/query', { query: userText });
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'ai',
          text: res.data.answer,
          insights: res.data.insights,
          category: res.data.category
        }
      ]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        { sender: 'ai', text: 'Error connecting to AI engine. Please try again.' }
      ]);
    } finally {
      setQueryLoading(false);
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'High': return <span className="badge badge-rose"><ShieldAlert className="w-3 h-3"/> High Risk</span>;
      case 'Medium': return <span className="badge badge-amber"><AlertTriangle className="w-3 h-3"/> Medium Risk</span>;
      default: return <span className="badge badge-green"><CheckCircle2 className="w-3 h-3"/> Low Risk</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI COO Intelligence Layer</h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> AI Generated Estimate
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">Autonomous risk detection, revenue forecasting & executive decision support</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'assistant'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Executive AI Assistant</span>
        </button>

        <button
          onClick={() => setActiveTab('risks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'risks'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Project Risk Flags ({risks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('forecast')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'forecast'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Revenue Forecast</span>
        </button>

        <button
          onClick={() => setActiveTab('leaks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'leaks'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Revenue Leaks</span>
        </button>

        <button
          onClick={() => setActiveTab('burnout')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'burnout'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Workload & Burnout</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'assistant' ? (
        /* Natural Language Query Interface (FR-8.1) */
        <div className="glass-panel p-6 flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-none shadow-md'
                      : 'bg-white/5 border border-[var(--border-color)] text-white rounded-bl-none'
                  }`}
                >
                  {msg.category && (
                    <span className="badge badge-purple text-[10px] uppercase font-bold block mb-1">
                      {msg.category}
                    </span>
                  )}
                  <p className="font-medium">{msg.text}</p>

                  {msg.insights && msg.insights.length > 0 && (
                    <div className="pt-2 space-y-1.5 border-t border-white/10">
                      {msg.insights.map((insight, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-indigo-200">
                          <span>•</span>
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {queryLoading && (
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] p-3">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span>AI COO is processing operational context...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendQuery} className="mt-4 pt-4 border-t border-[var(--border-color)] flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI COO (e.g., 'What should I focus on today?')..."
              className="input-field flex-1"
            />
            <button type="submit" disabled={queryLoading} className="btn-primary">
              <Send className="w-4 h-4" />
              <span>Ask AI</span>
            </button>
          </form>
        </div>
      ) : activeTab === 'risks' ? (
        /* Project Risk Flags (FR-8.2) */
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>AI Risk Scoring Engine evaluates deadline slippage, overdue task ratios, and budget variance across active tenant projects.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {risks.map((report) => (
              <div key={report.projectId} className="glass-panel p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <h3 className="text-base font-bold text-white">{report.projectName}</h3>
                  {getRiskBadge(report.riskLevel)}
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[var(--text-muted)]">Calculated Risk Score</span>
                    <span className="text-white">{report.riskScore} / 100</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        report.riskScore >= 60 ? 'bg-rose-500' : report.riskScore >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${report.riskScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                  <h4 className="font-semibold text-white uppercase text-[11px]">Risk Factors Identified:</h4>
                  {report.factors.map((f, i) => (
                    <p key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-rose-400 font-bold">•</span> {f}
                    </p>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-[var(--border-color)] text-xs text-indigo-300">
                  <strong className="block text-white mb-1">Recommended Action:</strong>
                  {report.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Revenue Forecast Engine (FR-8.3 & FR-8.4) */
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Predictive Cash Flow Model</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{forecast?.note}</p>
            </div>
            <span className="badge badge-green">Confidence: {forecast?.confidenceScore}%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-white/5 border border-[var(--border-color)] space-y-2">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Historical Monthly Average</span>
              <h3 className="text-2xl font-bold text-white">${forecast?.historicalMonthlyAverage.toLocaleString()}</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Based on paid transaction history</p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 border border-indigo-500/30 space-y-2">
              <span className="text-xs font-semibold text-indigo-300 uppercase">Projected Next Month</span>
              <h3 className="text-2xl font-bold text-indigo-400">${forecast?.projectedNextMonthRevenue.toLocaleString()}</h3>
              <span className="text-[11px] text-emerald-400 font-semibold">+14.5% projected growth</span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 space-y-2">
              <span className="text-xs font-semibold text-emerald-300 uppercase">Projected Quarter Revenue</span>
              <h3 className="text-2xl font-bold text-emerald-400">${forecast?.projectedQuarterRevenue.toLocaleString()}</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Estimated realization rate</p>
            </div>
          </div>
        </div>
      ) : activeTab === 'leaks' ? (
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-rose-400" /> Revenue Leaks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <h3 className="text-sm font-bold text-rose-300">Total Overdue</h3>
              <p className="text-2xl font-black text-white mt-2">${leaks?.totalOverdueAmount?.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <h3 className="text-sm font-bold text-amber-300">Stalled Projects</h3>
              <p className="text-2xl font-black text-white mt-2">{leaks?.stalledProjects?.length}</p>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <h3 className="font-bold text-white text-sm">Overdue Invoices</h3>
            {leaks?.overdueInvoices?.map((i: any) => (
              <div key={i.id} className="p-3 bg-white/5 border border-white/10 rounded flex justify-between text-xs">
                <span>{i.title} (Client: {i.clientName})</span>
                <span className="text-rose-400">${i.amount} - {i.daysOverdue} days overdue</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-400" /> Workload & Burnout
          </h2>
          <div className="space-y-4">
            {burnout?.map((b: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{b.employeeName}</span>
                  <span className={`badge ${b.riskLevel === 'High' ? 'badge-rose' : 'badge-amber'}`}>{b.riskLevel} Risk</span>
                </div>
                <div className="text-xs text-[var(--text-muted)] flex gap-4">
                  <span>Tasks: {b.taskCount}</span>
                  <span>Critical: {b.criticalTasks}</span>
                </div>
                <p className="text-xs text-indigo-300 mt-2"><strong>AI Suggestion:</strong> {b.suggestedAction}</p>
              </div>
            ))}
            {burnout?.length === 0 && <p className="text-xs text-[var(--text-muted)]">No team members are currently identified at risk of burnout.</p>}
          </div>
        </div>
      )}
    </div>
  );
};
