import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Bot, 
  Building2, 
  Users, 
  FolderKanban, 
  CheckSquare, 
  BookOpen, 
  DollarSign, 
  BarChart3, 
  CreditCard,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['CEO', 'Manager'] },
    { label: 'AI COO Layer', path: '/ai-coo', icon: Bot, roles: ['CEO', 'Manager'], badge: 'AI' },
    { label: 'Companies', path: '/companies', icon: Building2, roles: ['Super Admin'] },
    { label: 'Employees', path: '/employees', icon: Users, roles: ['CEO', 'Manager', 'Employee'] },
    { label: 'Projects', path: '/projects', icon: FolderKanban, roles: ['CEO', 'Manager', 'Employee'] },
    { label: 'Tasks Kanban', path: '/tasks', icon: CheckSquare, roles: ['CEO', 'Manager', 'Employee'] },
    { label: 'Time & Expenses', path: '/operations', icon: Clock, roles: ['CEO', 'Manager', 'Employee'] },
    { label: 'Knowledge Notes', path: '/knowledge', icon: BookOpen, roles: ['CEO', 'Manager', 'Employee'] },
    { label: 'Clients & Revenue', path: '/revenue', icon: DollarSign, roles: ['CEO', 'Manager'] },
    { label: 'Analytics BI', path: '/analytics', icon: BarChart3, roles: ['CEO', 'Manager'] },
    { label: 'SaaS Billing', path: '/billing', icon: CreditCard, roles: ['Super Admin'], badge: 'PRO' },
    { label: 'Security & Audit', path: '/security-audit', icon: ShieldCheck, roles: ['Super Admin'] }
  ];

  const visibleItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-[var(--bg-sidebar)] backdrop-blur-md border-r border-[var(--border-color)] flex flex-col justify-between p-4 min-h-screen">
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-[var(--border-color)]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
            M
          </div>
          <div>
            <h1 className="text-base font-bold gradient-text tracking-wide">MultiTenant</h1>
            <p className="text-xs text-[var(--text-muted)]">AI SaaS Platform v2.0</p>
          </div>
        </div>

        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/20 text-white border border-indigo-500/40 shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Role Indicator Footer */}
      <div className="p-3 rounded-xl bg-white/5 border border-[var(--border-color)] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold text-xs">
          {user?.role.substring(0, 2).toUpperCase()}
        </div>
        <div className="truncate">
          <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] text-[var(--text-muted)] truncate">{user?.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
