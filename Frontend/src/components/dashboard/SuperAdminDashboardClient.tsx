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
      <div className="flex-1 flex items-center justify-center bg-[#0f1117] text-[#8a9ab5]">
        Access denied
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0f1117] p-8 overflow-y-auto text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">System Governance Map</h2>
          <span className="px-2 py-0.5 text-xs font-mono font-semibold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 rounded">
            SYSTEM
          </span>
        </div>
        <button
          onClick={() => setShowCreateAdmin(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg text-sm transition-colors"
        >
          + Create Admin / Super Admin
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#0d1018] border-b border-white/[0.07] text-[#8a9ab5] text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#8a9ab5]">Loading...</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                  <td className="px-4 py-3 text-[#8a9ab5] text-sm">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={e => updateMutation.mutate({ id: u.id, payload: { role: e.target.value } })}
                      className="bg-[#161b25] border border-white/[0.08] rounded px-2 py-1 outline-none focus:border-[#4f7df7] text-sm text-white"
                      disabled={u.id === currentUser.id}
                    >
                      <option value="STUDENT">Student</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {u.status === 'BLOCKED' ? (
                      <span className="font-mono text-xs font-semibold uppercase px-2 py-1 rounded-full border bg-red-500/10 text-red-400 border-red-500/20">
                        Banned
                      </span>
                    ) : u.status === 'DELETED' ? (
                      <span className="font-mono text-xs font-semibold uppercase px-2 py-1 rounded-full border bg-slate-500/10 text-slate-400 border-slate-500/20">
                        Deleted
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-semibold uppercase px-2 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.id !== currentUser.id && u.status !== 'DELETED' && (
                      <div className="flex gap-2">
                        {u.status === 'BLOCKED' ? (
                          <button
                            onClick={() => updateMutation.mutate({ id: u.id, payload: { status: 'ACTIVE' } })}
                            className="text-[#4f7df7] text-sm px-3 py-1 hover:bg-[#4f7df7]/10 rounded transition-colors"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => updateMutation.mutate({ id: u.id, payload: { status: 'BLOCKED' } })}
                            className="text-red-400 text-sm px-3 py-1 hover:bg-red-400/10 rounded transition-colors"
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
                          className="text-[#8a9ab5] text-sm px-3 py-1 hover:bg-red-400/10 hover:text-red-400 rounded transition-colors"
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
                <td colSpan={5} className="py-8 text-center text-[#8a9ab5]">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Admin Modal */}
      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1117] rounded-2xl w-full max-w-md border border-white/[0.08] shadow-2xl overflow-hidden">
            {/* Shimmer top line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#4f7df7]/50 to-transparent" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-white">Create Admin / Super Admin</h3>
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
                  <label className="block text-sm text-[#8a9ab5] mb-1">Role</label>
                  <select
                    value={createForm.role}
                    onChange={e => setCreateForm(f => ({ ...f, role: e.target.value as 'ADMIN' | 'SUPER_ADMIN' }))}
                    className="w-full px-3 py-2 bg-[#161b25] border border-white/[0.08] rounded-lg text-white outline-none focus:border-[#4f7df7]"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#8a9ab5] mb-1">Name</label>
                  <input
                    required
                    type="text"
                    value={createForm.name}
                    onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#161b25] border border-white/[0.08] rounded-lg text-white outline-none focus:border-[#4f7df7]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8a9ab5] mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={createForm.email}
                    onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#161b25] border border-white/[0.08] rounded-lg text-white outline-none focus:border-[#4f7df7]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8a9ab5] mb-1">Password</label>
                  <input
                    required
                    type="password"
                    minLength={6}
                    value={createForm.password}
                    onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#161b25] border border-white/[0.08] rounded-lg text-white outline-none focus:border-[#4f7df7]"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateAdmin(false)}
                    className="px-4 py-2 text-[#8a9ab5] hover:text-white hover:bg-white/[0.05] rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
