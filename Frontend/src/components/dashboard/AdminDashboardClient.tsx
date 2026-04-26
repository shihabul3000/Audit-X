'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/services/api/auth.service';
import { userService } from '@/services/api/user.service';
import { companyService } from '@/services/api/company.service';
import { useUIStore } from '@/store/useUIStore';

export function AdminDashboardClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setActiveCompany } = useUIStore();

  const { data: currentUser } = useQuery({ queryKey: ['me'], queryFn: authService.getMe });
  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: userService.getAllUsers });
  const { data: companies = [] } = useQuery({ queryKey: ['companies'], queryFn: companyService.getCompanies });

  const assignMutation = useMutation({
    mutationFn: ({ companyId, userId }: { companyId: string; userId: string }) =>
      companyService.assignCompany(companyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Company assigned');
    },
    onError: () => toast.error('Failed to assign company'),
  });

  const unassignMutation = useMutation({
    mutationFn: ({ companyId, userId }: { companyId: string; userId: string }) =>
      companyService.unassignCompany(companyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Company unassigned');
    },
    onError: () => toast.error('Failed to unassign company'),
  });

  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    return <div className="flex-1 flex items-center justify-center bg-[#0f1117] text-[#8a9ab5]">Access denied</div>;
  }

  const students = users.filter(u => u.role === 'STUDENT');

  return (
    <div className="flex-1 bg-[#0f1117] p-8 overflow-y-auto text-white">
      <h2 className="text-3xl font-bold mb-6 tracking-tight text-white">
        Firm Management
      </h2>

      <div className="bg-[#0f1117] p-4 rounded-2xl shadow-lg border border-white/[0.07]">
        <h3 className="text-xl font-semibold mb-4 text-[#8a9ab5]">Student Assignments</h3>
        {isLoading ? (
          <p className="text-[#8a9ab5] text-center py-4">Loading...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.07] text-[#8a9ab5] text-sm">
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Assigned Companies</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const assignedCompanies = (s.companyAssignments || [])
                  .filter(a => !a.company.isDeleted)
                  .map(a => a.company);
                const assignedIds = assignedCompanies.map(c => c.id);
                const unassignedCompanies = companies.filter(c => !assignedIds.includes(c.id));

                return (
                  <tr key={s.id} className="border-b border-white/[0.04]">
                    <td className="py-3 font-medium">
                      {s.name}
                      <span className="text-[#8a9ab5] block text-xs">{s.email}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {assignedCompanies.map(c => (
                          <span
                            key={c.id}
                            className="px-2 py-1 bg-[#4f7df7]/10 text-[#4f7df7] text-xs rounded-full border border-[#4f7df7]/20 flex items-center group"
                          >
                            <button
                              onClick={() => {
                                setActiveCompany(c.id);
                                router.push('/dashboard/my-companies');
                              }}
                              className="hover:text-white transition-colors cursor-pointer"
                              title="View Company"
                            >
                              {c.name}
                            </button>
                            <button
                              onClick={() => unassignMutation.mutate({ companyId: c.id, userId: s.id })}
                              className="ml-1.5 text-red-400 hover:text-red-300 opacity-50 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <select
                        className="bg-[#161b25] border border-white/[0.08] focus:border-[#4f7df7] rounded px-2 py-1 outline-none text-xs w-48 text-[#8a9ab5] focus:text-white transition-colors"
                        onChange={(e) => {
                          if (e.target.value) {
                            assignMutation.mutate({ companyId: e.target.value, userId: s.id });
                            e.target.value = '';
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>Assign new company...</option>
                        {unassignedCompanies.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-[#8a9ab5]">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
