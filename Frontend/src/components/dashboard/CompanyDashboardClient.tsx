'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Send, Lock, Unlock, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { companyService } from '@/services/api/company.service';
import { financialYearService, type FinancialYear } from '@/services/api/financialYear.service';
import { authService } from '@/services/api/auth.service';
import { useUIStore } from '@/store/useUIStore';

export function CompanyDashboardClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { activeCompanyId, setActiveYear } = useUIStore();

  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState(`${new Date().getFullYear()}-06-30`);
  const [modalError, setModalError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; year: number } | null>(null);

  const { data: user } = useQuery({ queryKey: ['me'], queryFn: authService.getMe });
  const { data: companies = [] } = useQuery({ queryKey: ['companies'], queryFn: companyService.getCompanies });

  const activeCompany = companies.find(c => c.id === activeCompanyId);

  const { data: financialYears = [], isLoading: yearsLoading } = useQuery({
    queryKey: ['financial-years', activeCompanyId],
    queryFn: () => financialYearService.getFinancialYears(activeCompanyId!),
    enabled: !!activeCompanyId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const createYearMutation = useMutation({
    mutationFn: (date: string) => financialYearService.createFinancialYear(activeCompanyId!, date),
    onSuccess: (year) => {
      queryClient.invalidateQueries({ queryKey: ['financial-years', activeCompanyId] });
      setActiveYear(year.id);
      setShowModal(false);
      router.push('/fs/cover');
      toast.success('Financial year created!');
    },
    onError: (err: Error) => setModalError(err.message || 'Failed to create year'),
  });

  const deleteYearMutation = useMutation({
    mutationFn: (yearId: string) => financialYearService.deleteFinancialYear(yearId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-years', activeCompanyId] });
      setDeleteTarget(null);
      toast.success('Financial year deleted');
    },
    onError: () => toast.error('Failed to delete year'),
  });

  const submitMutation = useMutation({
    mutationFn: (yearId: string) => financialYearService.submitYear(yearId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-years', activeCompanyId] });
      toast.success('Submitted for review!');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to submit';
      toast.error(msg);
    },
  });

  const reviewActionMutation = useMutation({
    mutationFn: ({ yearId, action, note }: { yearId: string; action: string; note?: string }) =>
      financialYearService.reviewAction(yearId, action, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-years', activeCompanyId] });
      toast.success('Action performed successfully');
    },
    onError: () => toast.error('Action failed'),
  });

  const handleOpenYear = (yearId: string) => {
    setActiveYear(yearId);
    router.push('/fs/cover');
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isStudent = user?.role === 'STUDENT';

  const canEditYear = (fy: FinancialYear) => {
    if (!user) return false;
    if (fy.isLocked) return false;
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true;
    if (user.role === 'STUDENT') {
      return (fy.reviewStatus === 'DRAFT' || fy.reviewStatus === 'CHANGES_REQUESTED') &&
        (fy.createdByUserId === user.id || fy.assignments?.some(a => a.userId === user.id));
    }
    return false;
  };

  const statusStyles: Record<string, string> = {
    DRAFT: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    SUBMITTED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    UNDER_REVIEW: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    CHANGES_REQUESTED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    FINALIZED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  if (!activeCompany) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#121212] text-gray-400">
        <AlertCircle size={64} className="mb-6 opacity-20" />
        <h2 className="text-2xl font-semibold mb-2 text-white">No Company Selected</h2>
        <p>Select a company from the sidebar or create a new one to begin.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#121212] p-8 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-end border-b border-gray-800 pb-6">
          <div>
            <p className="text-sm font-medium text-blue-400 mb-1">Company Dashboard</p>
            <h1 className="text-4xl font-bold tracking-tight">{activeCompany.name}</h1>
          </div>
          <button
            onClick={() => { setModalError(''); setShowModal(true); }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
          >
            + Start New Year
          </button>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#222] text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold border-b border-gray-800">Financial Year</th>
                <th className="px-6 py-4 font-semibold border-b border-gray-800">Reporting Date</th>
                <th className="px-6 py-4 font-semibold border-b border-gray-800">Status</th>
                <th className="px-6 py-4 font-semibold border-b border-gray-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {yearsLoading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
              ) : financialYears.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">No financial years found. Start a new year to begin auditing.</td></tr>
              ) : (
                financialYears.map((fy) => {
                  const canEdit = canEditYear(fy);
                  return (
                    <tr key={fy.id} className="hover:bg-[#202020] transition-colors group">
                      <td className="px-6 py-4 font-medium text-white border-b border-gray-800/50">FY {fy.year}</td>
                      <td className="px-6 py-4 text-gray-300 border-b border-gray-800/50">{fy.reportingDate}</td>
                      <td className="px-6 py-4 border-b border-gray-800/50">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[fy.reviewStatus]}`}>
                          {fy.reviewStatus.replace('_', ' ')}
                          {fy.isLocked && <Lock size={10} className="ml-1.5" />}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right border-b border-gray-800/50">
                        <div className="flex items-center justify-end gap-2">
                          {isStudent && (fy.reviewStatus === 'DRAFT' || fy.reviewStatus === 'CHANGES_REQUESTED') && canEdit && (
                            <button onClick={() => submitMutation.mutate(fy.id)} className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                              <Send size={14} /> Submit
                            </button>
                          )}
                          {isAdmin && (
                            <>
                              {(fy.reviewStatus === 'SUBMITTED' || fy.reviewStatus === 'UNDER_REVIEW') && !fy.isLocked && (
                                <>
                                  <button onClick={() => reviewActionMutation.mutate({ yearId: fy.id, action: 'request_changes' })} className="text-amber-400 hover:text-amber-300 text-xs font-medium border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 rounded">
                                    Request Revisions
                                  </button>
                                  <button onClick={() => reviewActionMutation.mutate({ yearId: fy.id, action: 'finalize' })} className="text-emerald-400 hover:text-emerald-300 text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 rounded flex items-center gap-1">
                                    <Lock size={12} /> Confirm & Lock
                                  </button>
                                </>
                              )}
                              {fy.isLocked && (
                                <button onClick={() => reviewActionMutation.mutate({ yearId: fy.id, action: 'reopen' })} className="text-orange-400 hover:text-orange-300 text-xs font-medium border border-orange-500/30 bg-orange-500/10 px-2 py-1.5 rounded flex items-center gap-1">
                                  <Unlock size={12} /> Unlock
                                </button>
                              )}
                            </>
                          )}
                          <button onClick={() => handleOpenYear(fy.id)} className="px-4 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-md text-sm font-medium transition-all flex items-center gap-1">
                            {canEdit ? 'Continue' : <><Eye size={14} /> View</>}
                          </button>
                          {canEdit && (
                            <button onClick={() => setDeleteTarget({ id: fy.id, year: fy.year })} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-md p-6 border border-gray-800 shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Start New Financial Year</h3>
            <p className="text-gray-400 text-sm mb-6">Opening balances will be carried forward from the previous year automatically.</p>
            {modalError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{modalError}</div>}
            <form onSubmit={(e) => { e.preventDefault(); createYearMutation.mutate(newDate); }}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Reporting Date</label>
                <input type="date" required value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 font-medium">Cancel</button>
                <button type="submit" disabled={createYearMutation.isPending} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-lg">
                  {createYearMutation.isPending ? 'Creating...' : 'Confirm & Start'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-sm p-6 border border-red-900/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center"><Trash2 size={18} className="text-red-400" /></div>
              <h3 className="text-lg font-bold text-white">Delete Financial Year</h3>
            </div>
            <p className="text-white font-semibold mb-4 px-3 py-2 bg-[#2a2a2a] rounded-lg border border-gray-700">FY {deleteTarget.year}</p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-xs">⚠️ This action is irreversible. All audit data will be permanently deleted.</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 font-medium text-sm">Cancel</button>
              <button onClick={() => deleteYearMutation.mutate(deleteTarget.id)} disabled={deleteYearMutation.isPending} className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium rounded-lg text-sm flex items-center gap-2">
                <Trash2 size={14} /> Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
