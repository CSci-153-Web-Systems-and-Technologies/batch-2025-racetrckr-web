'use client';

import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 border border-[#fc4c02]/31">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 border-2 border-red-200">
          <LogOut className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-semibold text-center mb-3">
          Logout from <span className="text-[#fc4c02]">RaceTrackr</span>?
        </h2>
        <p className="text-gray-600 text-center mb-8 text-sm">
          You'll need to sign in again to access your races and track your progress.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
