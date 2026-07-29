import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Building, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-sidebar)] backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {user?.companyName ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Building className="w-3.5 h-3.5" />
            <span>{user.companyName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
            <Building className="w-3.5 h-3.5" />
            <span>Global Multi-Tenant Mode</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-semibold text-white">{user?.email}</p>
          <span className="text-[11px] text-[var(--text-muted)] font-medium">Role: {user?.role}</span>
        </div>

        <button
          onClick={logout}
          className="btn-secondary text-xs py-1.5 px-3 hover:border-rose-500/40 hover:text-rose-400"
          title="Logout of system"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
