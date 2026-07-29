import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Employee, Project, Task } from '../types';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { Clock, DollarSign, Plus, Play, Square, CheckCircle, XCircle, FileText, Briefcase, Calendar } from 'lucide-react';

interface TimeLogItem {
  _id: string;
  employeeId?: { _id: string; name: string; designation: string };
  projectId?: { _id: string; name: string };
  taskId?: { _id: string; title: string };
  durationMinutes: number;
  isBillable: boolean;
  hourlyRate: number;
  date: string;
  notes: string;
}

interface ExpenseItem {
  _id: string;
  employeeId?: { _id: string; name: string; designation: string };
  category: string;
  amount: number;
  description: string;
  receiptUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: { name: string };
  createdAt?: string;
}

export const Operations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timetracking' | 'expenses'>('timetracking');
  const [timeLogs, setTimeLogs] = useState<TimeLogItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Timer Widget State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Modals
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Time log form
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [hourlyRate, setHourlyRate] = useState('50');
  const [isBillable, setIsBillable] = useState(true);
  const [notes, setNotes] = useState('');

  // Expense form
  const [expEmployee, setExpEmployee] = useState('');
  const [expCategory, setExpCategory] = useState('Office');
  const [expAmount, setExpAmount] = useState('');
  const [expDescription, setExpDescription] = useState('');

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [timeRes, expRes, empRes, projRes, taskRes] = await Promise.all([
        api.get('/time-logs'),
        api.get('/expenses'),
        api.get('/employees'),
        api.get('/projects'),
        api.get('/tasks')
      ]);
      setTimeLogs(timeRes.data);
      setExpenses(expRes.data);
      setEmployees(empRes.data);
      setProjects(projRes.data);
      setTasks(taskRes.data);
    } catch (err) {
      console.error('Error fetching operational logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleCreateTimeLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/time-logs', {
        employeeId: selectedEmployee,
        projectId: selectedProject || undefined,
        taskId: selectedTask || undefined,
        durationMinutes: Number(durationMinutes),
        hourlyRate: Number(hourlyRate),
        isBillable,
        notes
      });
      setIsTimeModalOpen(false);
      setSelectedEmployee('');
      setSelectedProject('');
      setSelectedTask('');
      setDurationMinutes('');
      setNotes('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving time log');
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/expenses', {
        employeeId: expEmployee,
        category: expCategory,
        amount: Number(expAmount),
        description: expDescription
      });
      setIsExpenseModalOpen(false);
      setExpEmployee('');
      setExpAmount('');
      setExpDescription('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting expense');
    }
  };

  const handleExpenseStatus = async (expenseId: string, status: 'Approved' | 'Rejected') => {
    try {
      await api.patch(`/expenses/${expenseId}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const stopTimerAndSave = () => {
    setIsTimerRunning(false);
    const mins = Math.max(1, Math.round(seconds / 60));
    setDurationMinutes(String(mins));
    setSeconds(0);
    setIsTimeModalOpen(true);
  };

  const canApproveExpense = ['Super Admin', 'CEO', 'Manager'].includes(user?.role || '');

  const totalLoggedHours = timeLogs.reduce((sum, log) => sum + log.durationMinutes, 0) / 60;
  const totalBillableAmount = timeLogs.filter(l => l.isBillable).reduce((sum, l) => sum + (l.durationMinutes / 60) * l.hourlyRate, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Time & Expense Operations</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Track billable project hours, timesheets & employee expenses</p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'timetracking' ? (
            <button onClick={() => setIsTimeModalOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              <span>Log Manual Hours</span>
            </button>
          ) : (
            <button onClick={() => setIsExpenseModalOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              <span>Submit Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Stopwatch Widget Card */}
      <div className="glass-panel p-5 flex items-center justify-between bg-gradient-to-r from-indigo-900/20 via-violet-900/20 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Task Timer Widget</h3>
            <p className="text-2xl font-extrabold text-white font-mono mt-0.5">{formatTimer(seconds)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isTimerRunning ? (
            <button onClick={() => setIsTimerRunning(true)} className="btn-primary bg-emerald-600 hover:bg-emerald-500 border-none">
              <Play className="w-4 h-4" />
              <span>Start Timer</span>
            </button>
          ) : (
            <button onClick={stopTimerAndSave} className="btn-primary bg-rose-600 hover:bg-rose-500 border-none">
              <Square className="w-4 h-4" />
              <span>Stop & Save Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
        <button
          onClick={() => setActiveTab('timetracking')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'timetracking'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Timesheets & Labor ({timeLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'expenses'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Employee Expenses ({expenses.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'timetracking' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Total Hours Logged</span>
              <h3 className="text-2xl font-bold text-white">{totalLoggedHours.toFixed(1)} hrs</h3>
            </div>
            <div className="glass-panel p-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Total Billable Labor</span>
              <h3 className="text-2xl font-bold text-emerald-400">${totalBillableAmount.toLocaleString()}</h3>
            </div>
          </div>

          <div className="glass-panel overflow-hidden">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Project / Task</th>
                  <th>Duration</th>
                  <th>Rate ($/hr)</th>
                  <th>Billable Value</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {timeLogs.map((log) => {
                  const hours = log.durationMinutes / 60;
                  const val = hours * log.hourlyRate;
                  return (
                    <tr key={log._id}>
                      <td className="font-semibold text-white">{log.employeeId?.name || 'Staff'}</td>
                      <td className="text-xs text-[var(--text-muted)]">
                        {log.projectId?.name || 'General Task'}
                        {log.taskId && ` • ${log.taskId.title}`}
                      </td>
                      <td className="font-bold text-white">{hours.toFixed(1)} hrs ({log.durationMinutes}m)</td>
                      <td>${log.hourlyRate}/hr</td>
                      <td className="font-bold text-emerald-400">
                        {log.isBillable ? `$${val.toFixed(2)}` : 'Non-billable'}
                      </td>
                      <td className="text-xs text-[var(--text-muted)]">
                        {new Date(log.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount ($)</th>
                <th>Status</th>
                {canApproveExpense && <th className="text-right">Approval Action</th>}
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td className="font-semibold text-white">{exp.employeeId?.name || 'Staff'}</td>
                  <td><span className="badge badge-purple">{exp.category}</span></td>
                  <td className="text-xs text-[var(--text-muted)] max-w-xs truncate">{exp.description}</td>
                  <td className="font-bold text-white">${exp.amount.toLocaleString()}</td>
                  <td>
                    {exp.status === 'Approved' ? (
                      <span className="badge badge-green"><CheckCircle className="w-3 h-3"/> Approved</span>
                    ) : exp.status === 'Rejected' ? (
                      <span className="badge badge-rose"><XCircle className="w-3 h-3"/> Rejected</span>
                    ) : (
                      <span className="badge badge-amber"><Clock className="w-3 h-3"/> Pending</span>
                    )}
                  </td>
                  {canApproveExpense && (
                    <td className="text-right">
                      {exp.status === 'Pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => handleExpenseStatus(exp._id, 'Approved')} className="btn-primary py-1 px-2 text-[11px] bg-emerald-600 hover:bg-emerald-500">
                            Approve
                          </button>
                          <button onClick={() => handleExpenseStatus(exp._id, 'Rejected')} className="btn-secondary py-1 px-2 text-[11px] hover:text-rose-400">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[var(--text-dim)]">Processed</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Time Log Modal */}
      <Modal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)} title="Log Worked Hours">
        <form onSubmit={handleCreateTimeLog} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Employee</label>
            <select required value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="input-field bg-[#0f172a]">
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.designation})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Project (Optional)</label>
              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="input-field bg-[#0f172a]">
                <option value="">Select Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Task (Optional)</label>
              <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="input-field bg-[#0f172a]">
                <option value="">Select Task</option>
                {tasks.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Duration (Minutes)</label>
              <input type="number" required value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} placeholder="120" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Hourly Rate ($)</label>
              <input type="number" required value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="50" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Notes / Activity Summary</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Debugging Docker container issue..." className="input-field" />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={() => setIsTimeModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Time Log</button>
          </div>
        </form>
      </Modal>

      {/* Expense Modal */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Submit Employee Expense">
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Employee Name</label>
            <select required value={expEmployee} onChange={(e) => setExpEmployee(e.target.value)} className="input-field bg-[#0f172a]">
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Category</label>
              <select value={expCategory} onChange={(e) => setExpCategory(e.target.value)} className="input-field bg-[#0f172a]">
                <option value="Office">Office</option>
                <option value="Software">Software</option>
                <option value="Travel">Travel</option>
                <option value="Hardware">Hardware</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Amount ($)</label>
              <input type="number" required value={expAmount} onChange={(e) => setExpAmount(e.target.value)} placeholder="150" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Expense Description</label>
            <textarea required value={expDescription} onChange={(e) => setExpDescription(e.target.value)} rows={3} placeholder="Client lunch or AWS server renewal..." className="input-field" />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Submit Expense</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
