import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Client, Revenue, Project, PaymentStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { DollarSign, Plus, Building, Mail, Phone, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const RevenuePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'clients'>('revenue');
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  // Revenue form
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Pending');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [clientId, setClientId] = useState('');

  // Client form
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [revRes, clientRes, projRes] = await Promise.all([
        api.get('/revenues'),
        api.get('/clients'),
        api.get('/projects')
      ]);
      setRevenues(revRes.data);
      setClients(clientRes.data);
      setProjects(projRes.data);
    } catch (err) {
      console.error('Error fetching financial records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRevenue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/revenues', {
        title,
        amount: Number(amount),
        paymentStatus,
        dueDate,
        projectId: projectId || undefined,
        clientId: clientId || undefined
      });
      setIsRevenueModalOpen(false);
      setTitle('');
      setAmount('');
      setPaymentStatus('Pending');
      setDueDate('');
      setProjectId('');
      setClientId('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating revenue entry');
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/clients', {
        name: clientName,
        companyName: clientCompany,
        email: clientEmail,
        phone: clientPhone
      });
      setIsClientModalOpen(false);
      setClientName('');
      setClientCompany('');
      setClientEmail('');
      setClientPhone('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating client');
    }
  };

  const handleUpdateStatus = async (revenueId: string, newStatus: PaymentStatus) => {
    try {
      await api.patch(`/revenues/${revenueId}/status`, { paymentStatus: newStatus });
      fetchData();
    } catch (err) {
      alert('Error updating payment status');
    }
  };

  const getStatusBadge = (st: PaymentStatus) => {
    switch (st) {
      case 'Paid': return <span className="badge badge-green"><CheckCircle className="w-3 h-3"/> Paid</span>;
      case 'Pending': return <span className="badge badge-amber"><Clock className="w-3 h-3"/> Pending</span>;
      case 'Overdue': return <span className="badge badge-rose"><AlertTriangle className="w-3 h-3"/> Overdue</span>;
    }
  };

  const totalPaid = revenues.filter(r => r.paymentStatus === 'Paid').reduce((sum, r) => sum + r.amount, 0);
  const totalPending = revenues.filter(r => r.paymentStatus === 'Pending' || r.paymentStatus === 'Overdue').reduce((sum, r) => sum + r.amount, 0);

  const canManageRevenue = ['Super Admin', 'CEO'].includes(user?.role || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Financial & Client Ledger</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Tenant revenue collection, client billing & invoice milestones</p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'revenue' ? (
            canManageRevenue && (
              <button onClick={() => setIsRevenueModalOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4" />
                <span>Create Invoice Record</span>
              </button>
            )
          ) : (
            <button onClick={() => setIsClientModalOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              <span>Add Client</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Total Collected Paid</span>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">${totalPaid.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            $
          </div>
        </div>

        <div className="glass-panel p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Pending Receivables</span>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">${totalPending.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            ⌛
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
        <button
          onClick={() => setActiveTab('revenue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'revenue'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Revenue Ledger ({revenues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'clients'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Client Roster ({clients.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'revenue' ? (
        <div className="glass-panel overflow-hidden">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Invoice Title</th>
                <th>Client / Project</th>
                <th>Amount ($)</th>
                <th>Due Date</th>
                <th>Status</th>
                {canManageRevenue && <th className="text-right">Update Status</th>}
              </tr>
            </thead>
            <tbody>
              {revenues.map((rev) => (
                <tr key={rev._id}>
                  <td className="font-semibold text-white">{rev.title}</td>
                  <td className="text-xs text-[var(--text-muted)]">
                    {rev.clientId?.companyName || 'General Client'}
                    {rev.projectId && ` • ${rev.projectId.name}`}
                  </td>
                  <td className="font-bold text-white">${rev.amount.toLocaleString()}</td>
                  <td className="text-xs text-[var(--text-muted)]">
                    {new Date(rev.dueDate).toLocaleDateString()}
                  </td>
                  <td>{getStatusBadge(rev.paymentStatus)}</td>
                  {canManageRevenue && (
                    <td className="text-right">
                      <select
                        value={rev.paymentStatus}
                        onChange={(e) => handleUpdateStatus(rev._id, e.target.value as PaymentStatus)}
                        className="input-field text-xs py-1 px-2 bg-[#0f172a]"
                      >
                        <option value="Paid">Mark Paid</option>
                        <option value="Pending">Mark Pending</option>
                        <option value="Overdue">Mark Overdue</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((c) => (
            <div key={c._id} className="glass-panel p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300">
                  {c.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{c.name}</h3>
                  <p className="text-xs text-indigo-300 font-semibold">{c.companyName}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-indigo-400"/> {c.email}</p>
                {c.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-cyan-400"/> {c.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revenue Modal */}
      <Modal isOpen={isRevenueModalOpen} onClose={() => setIsRevenueModalOpen(false)} title="Create Revenue Record">
        <form onSubmit={handleCreateRevenue} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Invoice Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Milestone 1 Payment" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Amount ($)</label>
              <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="25000" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Payment Status</label>
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)} className="input-field bg-[#0f172a]">
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Due Date</label>
            <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Client (Optional)</label>
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="input-field bg-[#0f172a]">
                <option value="">Select Client</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>{c.name} ({c.companyName})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Project (Optional)</label>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="input-field bg-[#0f172a]">
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={() => setIsRevenueModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Invoice</button>
          </div>
        </form>
      </Modal>

      {/* Client Modal */}
      <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Add Client Record">
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Contact Person Name</label>
            <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Robert Vance" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Client Company Name</label>
            <input type="text" required value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} placeholder="Acme Global Inc" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Email Address</label>
            <input type="email" required value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="robert@acme.com" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Phone Number</label>
            <input type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="input-field" />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={() => setIsClientModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Client</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
