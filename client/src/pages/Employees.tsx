import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Employee } from '../types';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { Users, Plus, Mail, DollarSign, Calendar, UserCheck, Eye } from 'lucide-react';

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');
  const [joinDate, setJoinDate] = useState('');

  const { user } = useAuth();

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/company/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employee roster', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/company/employees', {
        name,
        email,
        designation,
        department,
        salary: Number(salary),
        joinDate: joinDate || new Date().toISOString()
      });
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setDesignation('');
      setDepartment('');
      setSalary('');
      setJoinDate('');
      fetchEmployees();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error adding employee');
    }
  };

  const canManage = ['Super Admin', 'CEO', 'Manager'].includes(user?.role || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Employee Directory</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Tenant employee roster & departmental organization</p>
        </div>

        {canManage && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Salary (USD)</th>
                <th>Joined Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300">
                        {emp.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{emp.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-purple">{emp.designation}</span>
                  </td>
                  <td>
                    <span className="badge badge-blue">{emp.department}</span>
                  </td>
                  <td className="font-semibold text-emerald-400">
                    ${emp.salary.toLocaleString()}
                  </td>
                  <td className="text-xs text-[var(--text-muted)]">
                    {new Date(emp.joinDate).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="btn-secondary py-1 px-2 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Employee to Tenant">
        <form onSubmit={handleAddEmployee} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@company.com" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Designation</label>
              <input type="text" required value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Senior Developer" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Department</label>
              <input type="text" required value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Annual Salary ($)</label>
              <input type="number" required value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="105000" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Join Date</label>
              <input type="date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Employee</button>
          </div>
        </form>
      </Modal>

      {/* Employee Profile View Modal */}
      {selectedEmployee && (
        <Modal isOpen={!!selectedEmployee} onClose={() => setSelectedEmployee(null)} title="Employee Profile Details">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl text-white">
                {selectedEmployee.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedEmployee.name}</h3>
                <p className="text-xs text-indigo-300">{selectedEmployee.designation} • {selectedEmployee.department}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-[var(--text-muted)]">
              <p><strong className="text-white">Email:</strong> {selectedEmployee.email}</p>
              <p><strong className="text-white">Compensation:</strong> ${selectedEmployee.salary.toLocaleString()}/yr</p>
              <p><strong className="text-white">Date Joined:</strong> {new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
            </div>

            <div className="flex justify-end pt-3">
              <button onClick={() => setSelectedEmployee(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
