import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const ProfilePage: React.FC = () => {
  const currentUser = useAppStore(state => state.currentUser);

  if (!currentUser) return null;

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl tracking-tight text-white font-bold mb-6">User Profile</h1>

        <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800 flex items-center space-x-6 mb-8">
          <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{currentUser.name}</h2>
            <p className="text-gray-400">{currentUser.email}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {currentUser.role.replace('_', ' ')}
            </div>
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white mb-1">Account Information</h3>
            <p className="text-sm text-gray-400">Personal details and application status.</p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-gray-400">Account ID</div>
              <div className="col-span-2 text-sm text-white font-mono">{currentUser.id}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-gray-400">Email Status</div>
              <div className="col-span-2 text-sm text-white">
                {currentUser.status === 'ACTIVE' ? (
                  <span className="text-green-400">Verified</span>
                ) : (
                  <span className="text-red-400">Not Verified</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium text-gray-400">Account Status</div>
              <div className="col-span-2 text-sm text-white capitalize">{currentUser.status}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
