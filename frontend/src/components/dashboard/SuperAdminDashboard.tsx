import React, { useState, useEffect } from 'react';
import { useAppStore, authSelectors } from '../../store/useAppStore';
import { userService } from '../../services/user.service';
import toast from 'react-hot-toast';

export const SuperAdminDashboard: React.FC = () => {
  const currentUser = useAppStore(authSelectors.getCurrentUser);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers();
      setUsers(res.data.data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (currentUser?.role !== 'SUPER_ADMIN') return null;

  const handleBan = async (userId: string) => {
    try {
      await userService.updateStatus(userId, 'BANNED', 'Policy violation');
      toast.success('User banned');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to ban user');
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await userService.updateStatus(userId, 'ACTIVE');
      toast.success('User unbanned');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to unban user');
    }
  };

  return (
    <div className="flex-1 bg-[#121212] p-8 overflow-y-auto text-white">
      <h2 className="text-3xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">System Governance</h2>
      <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-lg border border-gray-800">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
            Loading users...
          </div>
        ) : (
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
                    <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-blue-500/10 text-blue-400">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3">
                    {u.status === 'BANNED'
                      ? <span className="text-red-400 font-bold text-xs uppercase bg-red-400/10 px-2 py-1 rounded">Banned</span>
                      : <span className="text-emerald-400 font-bold text-xs uppercase bg-emerald-400/10 px-2 py-1 rounded">Active</span>
                    }
                  </td>
                  <td className="py-3">
                    {u.id !== currentUser?.id && (
                      u.status === 'BANNED' ? (
                        <button onClick={() => handleUnban(u.id)} className="text-blue-400 text-sm px-3 py-1 hover:bg-blue-400/10 rounded">Unban</button>
                      ) : (
                        <button onClick={() => handleBan(u.id)} className="text-red-400 text-sm px-3 py-1 hover:bg-red-400/10 rounded">Ban</button>
                      )
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="py-4 text-center text-gray-500">No users found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
