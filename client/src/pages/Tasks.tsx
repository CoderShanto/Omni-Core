import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Task, Project, Employee, TaskPriority, TaskStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { CheckSquare, Plus, Clock, User, AlertCircle, ArrowRight } from 'lucide-react';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [deadline, setDeadline] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [taskRes, projRes, empRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
        api.get('/employees')
      ]);
      setTasks(taskRes.data);
      setProjects(projRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error('Error fetching task board', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title,
        description,
        priority,
        deadline,
        projectId: projectId || undefined,
        assignedTo: assignedTo || undefined
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDeadline('');
      setProjectId('');
      setAssignedTo('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating task');
    }
  };

  const handleStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'Critical': return <span className="badge badge-rose">Critical</span>;
      case 'High': return <span className="badge badge-amber">High</span>;
      case 'Medium': return <span className="badge badge-blue">Medium</span>;
      case 'Low': return <span className="badge badge-green">Low</span>;
    }
  };

  const columns: { label: string; status: TaskStatus }[] = [
    { label: 'To Do', status: 'Todo' },
    { label: 'In Progress', status: 'Doing' },
    { label: 'Under Review', status: 'Review' },
    { label: 'Done & Verified', status: 'Done' }
  ];

  const canCreate = ['Super Admin', 'CEO', 'Manager'].includes(user?.role || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Task Kanban Board</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Assign, track, and update active project task items</p>
        </div>

        {canCreate && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className="glass-panel p-4 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{col.label}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnTasks.map((t) => (
                    <div key={t._id} className="p-4 rounded-xl bg-white/5 border border-[var(--border-color)] hover:border-indigo-500/40 transition-all space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white leading-snug">{t.title}</h4>
                        {getPriorityBadge(t.priority)}
                      </div>

                      {t.description && (
                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{t.description}</p>
                      )}

                      {t.projectId && (
                        <span className="text-[10px] font-semibold text-indigo-300 block truncate">
                          📁 {t.projectId.name}
                        </span>
                      )}

                      <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-cyan-400" />
                          {t.assignedTo ? t.assignedTo.name : 'Unassigned'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {new Date(t.deadline).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Status quick mover */}
                      <div className="pt-1 flex items-center justify-between">
                        <select
                          value={t.status}
                          onChange={(e) => handleStatusUpdate(t._id, e.target.value as TaskStatus)}
                          className="input-field text-[11px] py-1 px-1.5 bg-[#0f172a]"
                        >
                          <option value="Todo">Move: To Do</option>
                          <option value="Doing">Move: In Progress</option>
                          <option value="Review">Move: Under Review</option>
                          <option value="Done">Move: Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create & Assign Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Task Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Build JWT auth middleware" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Task Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Detailed instructions..." className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="input-field bg-[#0f172a]">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Deadline Date</label>
              <input type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Linked Project</label>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="input-field bg-[#0f172a]">
                <option value="">Select Project (Optional)</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Assignee</label>
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="input-field bg-[#0f172a]">
                <option value="">Select Employee</option>
                {employees.map((e) => (
                  <option key={e._id} value={e._id}>{e.name} ({e.designation})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Assign Task</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
