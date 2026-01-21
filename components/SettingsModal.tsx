import React from 'react';
import { X, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout
}) => {
  if (!isOpen) return null;

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-semibold">Settings</h2>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Profile</h3>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
                  {user?.email ? user.email.substring(0, 2).toUpperCase() : <UserIcon size={20} />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {user?.email ? user.email.split('@')[0] : 'Guest'}
                  </div>
                  <div className="text-xs text-slate-500">{user?.email || 'Not logged in'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Account</h3>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              More settings coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
