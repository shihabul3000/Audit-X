'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authService } from '@/services/api/auth.service';
import { userService } from '@/services/api/user.service';

export function SuperAdminDashboardClient() {
  const queryClient = useQueryClient();
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN' as 'ADMIN' | 'SUPER_ADMIN',
  });

  const { data: currentUser } = useQuery({ queryKey: ['me'], queryFn: authService.getMe });
  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: userService.getAllUsers });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { role?: string; status?: string } }) =>
      userService.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated');
    },
    onError: () => toast.error('Failed to update user'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted');
    },
    onError: () => toast.error('Failed to delete user'),
  });

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; email: string; password: string }) =>
      createForm.role === 'ADMIN'
        ? userService.createAdmin(payload)
        : userService.createSuperAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowCreateAdmin(false);
      setCreateForm({ name: '', email: '', password: '', role: 'ADMIN' });
      toast.success(`${createForm.role === 'ADMIN' ? 'Admin' : 'Super Admin'} created!`);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create user'),
  });

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#121212] text-gray-400">
        Access denied
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#121212] p-8 overflow-y-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">
          System Governance Map
        </h2>
        <button
          onClick={() => setShowCreateAdmin(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg text-sm transition-colors"
        >
          + Create Admin / Super Admin
        </button>
      </div>

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
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="border-b border-gray-800/50">
                  <td className="py-3 font-medium">{u.name}</td>
                  <td className="py-3 text-gray-400 text-sm">{u.email}</td>
                  <td className="py-3">
                    <select
                      value={u.role}
                      onChange={e => updateMutation.mutate({ id: u.id, payload: { role: e.target.value } })}
                      className="bg-black border border-gray-700 rounded px-2 py-1 outline-none focus:border-blue-500 text-sm"
                      disabled={u.id === currentUser.id}
                    >
                      <option value="STUDENT">Student</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </td>
                  <td className="py-3">
                    {u.status === 'BLOCKED' ? (
                      <span className="text-red-400 font-bold text-xs uppercase bg-red-400/10 px-2 py-1 rounded">
                        Banned
                      </span>
                    ) : u.status === 'DELETED' ? (
                      <span className="text-gray-400 font-bold text-xs uppercase bg-gray-400/10 px-2 py-1 rounded">
                        Deleted
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold text-xs uppercase bg-emerald-400/10 px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    {u.id !== currentUser.id && u.status !== 'DELETED' && (
                      <div className="flex gap-2">
                        {u.status === 'BLOCKED' ? (
                          <button
                            onClick={() => updateMutation.mutate({ id: u.id, payload: { status: 'ACTIVE' } })}
                            className="text-blue-400 text-sm px-3 py-1 hover:bg-blue-400/10 rounded"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => updateMutation.mutate({ id: u.id, payload: { status: 'BLOCKED' } })}
                            className="text-red-400 text-sm px-3 py-1 hover:bg-red-400/10 rounded"
                          >
                            Ban
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${u.name}? This cannot be undone.`)) {
                              deleteMutation.mutate(u.id);
                            }
                          }}
                          className="text-gray-500 text-sm px-3 py-1 hover:bg-red-400/10 hover:text-red-400 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
            {!isLoading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Admin Modal */}
      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-md p-6 border border-gray-800 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Create Admin / Super Admin</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate({
                  name: createForm.name,
                  email: createForm.email,
                  password: createForm.password,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm text-gray-300 mb-1">Role</label>
                <select
                  value={createForm.role}
                  onChange={e => setCreateForm(f => ({ ...f, role: e.target.value as 'ADMIN' | 'SUPER_ADMIN' }))}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white outline-none"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input
                  required
                  type="text"
                  value={createForm.name}
                  onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={createForm.email}
                  onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Password</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={createForm.password}
                  onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAdmin(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium rounded-lg"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
