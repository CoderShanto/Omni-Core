import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Company } from '../types';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { Building2, Plus, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

export const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New company form state
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const { user } = useAuth();

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Error fetching companies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/companies', { name, industry, address, email, phone });
      setIsModalOpen(false);
      setName('');
      setIndustry('');
      setAddress('');
      setEmail('');
      setPhone('');
      fetchCompanies();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating company');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Company Management</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Multi-tenant company profiles & workspace credentials</p>
        </div>

        {user?.role === 'Super Admin' && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span>Create New Tenant Company</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((comp) => (
            <div key={comp._id} className="glass-panel p-6 glass-card-interactive space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{comp.name}</h3>
                  <span className="badge badge-purple mt-1">
                    <Briefcase className="w-3 h-3" />
                    {comp.industry}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                {comp.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{comp.email}</span>
                  </div>
                )}
                {comp.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{comp.phone}</span>
                  </div>
                )}
                {comp.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{comp.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Company Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Tenant Company">
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Company Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Apex Tech Solutions" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Industry Category</label>
            <input type="text" required value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Software Development" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Corporate Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="100 Silicon Way" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Official Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@company.com" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Phone Number</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="input-field" />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Company</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
