import React, { useState } from 'react';
import { useAppStore, authSelectors } from '../../store/useAppStore';

export const SuperAdminDashboard: React.FC = () => {
  const users = useAppStore(state => state.users);
  const currentUser = useAppStore(authSelectors.getCurrentUser);
  const updateUserRole = useAppStore(state => state.updateUserRole);
  const banUser = useAppStore(state => state.banUser);
  const unbanUser = useAppStore(state => state.unbanUser);

  if (currentUser?.role !== 'SUPER_ADMIN') return null;

  return (
    <div className="flex-1 bg-[#121212] p-8 overflow-y-auto text-white">
      <h2 className="text-3xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">System Governance Map</h2>
      <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-lg border border-gray-800">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-sm">
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-800/50">
                <td className="py-3">{u.name}</td>
                <td className="py-3 text-gray-400">{u.email}</td>
                <td className="py-3">
                  <select 
                     value={u.role} 
                     onChange={e => updateUserRole(u.id, e.target.value as any)}
                     className="bg-black border border-gray-700 rounded px-2 py-1 outline-none focus:border-blue-500"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </td>
                <td className="py-3">
                  {u.status === 'BANNED' ? <span className="text-red-400 font-bold text-xs uppercase bg-red-400/10 px-2 py-1 rounded">Banned</span> : <span className="text-emerald-400 font-bold text-xs uppercase bg-emerald-400/10 px-2 py-1 rounded">Active</span>}
                </td>
                <td className="py-3">
                  {u.status === 'BANNED' ? (
                     <button onClick={() => unbanUser(u.id)} className="text-blue-400 text-sm px-3 py-1 hover:bg-blue-400/10 rounded">Unban</button>
                  ) : (
                     <button onClick={() => banUser(u.id, 'Violation')} className="text-red-400 text-sm px-3 py-1 hover:bg-red-400/10 rounded">Ban</button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={5} className="py-4 text-center text-gray-500">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
