import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Project, Employee, ProjectStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { FolderKanban, Plus, Calendar, DollarSign, Users, AlertCircle } from 'lucide-react';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Pending');
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [projRes, empRes] = await Promise.all([
        api.get('/company/projects'),
        api.get('/company/employees')
      ]);
      setProjects(projRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error('Error loading project space', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/company/projects', {
        name,
        description,
        budget: Number(budget),
        deadline,
        status,
        team: selectedTeam
      });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      setBudget('');
      setDeadline('');
      setStatus('Pending');
      setSelectedTeam([]);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating project');
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
    try {
      await api.put(`/company/projects/${projectId}`, { status: newStatus });
      fetchData();
    } catch (err: any) {
      alert('Error updating status');
    }
  };

  const getStatusBadge = (st: ProjectStatus) => {
    switch (st) {
      case 'Completed': return <span className="badge badge-green">Completed</span>;
      case 'In Progress': return <span className="badge badge-purple">In Progress</span>;
      case 'Pending': return <span className="badge badge-amber">Pending</span>;
      case 'Cancelled': return <span className="badge badge-rose">Cancelled</span>;
    }
  };

  const canManage = ['Super Admin', 'CEO', 'Manager'].includes(user?.role || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Project Management</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Track company deliverables, timelines, and team assignments</p>
        </div>

        {canManage && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div key={proj._id} className="glass-panel p-6 glass-card-interactive flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-white leading-snug">{proj.name}</h3>
                  {getStatusBadge(proj.status)}
                </div>

                <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2">{proj.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Budget: <strong className="text-white">${proj.budget.toLocaleString()}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {new Date(proj.deadline).toLocaleDateString()}
                  </span>
                </div>

                {/* Team Avatars */}
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] font-semibold flex items-center gap-1 mb-1.5">
                    <Users className="w-3 h-3 text-cyan-400" /> Assigned Team:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proj.team && proj.team.length > 0 ? (
                      proj.team.map((member) => (
                        <span key={member._id} className="px-2 py-0.5 rounded bg-white/5 border border-[var(--border-color)] text-[11px] text-indigo-300">
                          {member.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-[var(--text-dim)]">No team assigned</span>
                    )}
                  </div>
                </div>

                {/* Status Update Selector */}
                {canManage && (
                  <div className="pt-2">
                    <select
                      value={proj.status}
                      onChange={(e) => handleStatusChange(proj._id, e.target.value as ProjectStatus)}
                      className="input-field text-xs py-1 px-2 bg-[#0f172a]"
                    >
                      <option value="Pending">Status: Pending</option>
                      <option value="In Progress">Status: In Progress</option>
                      <option value="Completed">Status: Completed</option>
                      <option value="Cancelled">Status: Cancelled</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Project Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Project Alpha SaaS" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Project objectives and scope..." className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Allocated Budget ($)</label>
              <input type="number" required value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="150000" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Target Deadline</label>
              <input type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Assign Team Members</label>
            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-white/5 border border-[var(--border-color)]">
              {employees.map((emp) => (
                <label key={emp._id} className="flex items-center gap-2 text-xs text-white cursor-pointer hover:bg-white/5 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={selectedTeam.includes(emp._id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedTeam([...selectedTeam, emp._id]);
                      else setSelectedTeam(selectedTeam.filter(id => id !== emp._id));
                    }}
                  />
                  <span>{emp.name} ({emp.designation})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Project</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
