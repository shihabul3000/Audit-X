import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, authSelectors, permissionSelectors } from '../../store/useAppStore';
import { Trash2, Send, Lock, Unlock, Eye, AlertCircle, Plus, Check } from 'lucide-react';
import { financialYearService } from '../../services/financialYear.service';
import { companyService } from '../../services/company.service';
import { reviewService } from '../../services/review.service';
import toast from 'react-hot-toast';

export const CompanyDashboard: React.FC = () => {
  const companies = useAppStore(state => state.companies);
  const currentUser = useAppStore(authSelectors.getCurrentUser);
  const activeCompanyId = useAppStore(state => state.activeCompanyId);
  const setActiveYearId = useAppStore(state => state.setActiveYear);

  const navigate = useNavigate();

  const [financialYears, setFinancialYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const [newDate, setNewDate] = useState(`${currentYear}-06-30`);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; year: number } | null>(null);

  const activeCompany = companies.find(c => c.id === activeCompanyId);
  
  // Note: we're using partial objects from our local list, real perms might need a full company object
  const hasAccess = true; // Temporary simplification, normally read from currentUser logic

  const loadFinancialYears = async () => {
    if (!activeCompanyId) return;
    setLoading(true);
    try {
      const response = await financialYearService.getAllByCompany(activeCompanyId);
      setFinancialYears(response.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load financial years');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinancialYears();
  }, [activeCompanyId]);

  if (!activeCompany || !hasAccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#121212] text-gray-400">
        <div className="w-24 h-24 mb-6 opacity-20">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-white">No Company Selected</h2>
        <p>Select a company from the sidebar or create a new one to begin.</p>
      </div>
    );
  }

  const handleOpenYear = (yearId: string) => {
    setActiveYearId(yearId);
    navigate(`/fs/cover`);
  };

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const toastId = toast.loading('Creating financial year...');
    try {
      const response = await financialYearService.create(activeCompanyId, newDate);
      toast.success('Financial year created', { id: toastId });
      setShowModal(false);
      setNewDate(`${currentYear + 1}-06-30`);
      await loadFinancialYears();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create financial year', { id: toastId });
      setError(err.message);
    }
  };

  const submitFinancialYear = async (yearId: string) => {
    const toastId = toast.loading('Submitting for review...');
    try {
      await reviewService.submitForReview(yearId);
      toast.success('Submitted successfully', { id: toastId });
      loadFinancialYears();
    } catch (err: any) {
      toast.error(err.message || 'Submit failed', { id: toastId });
    }
  };

  const requestRevisions = async (yearId: string) => {
    const note = window.prompt("Enter revision notes for the student:");
    if (!note) return;
    const toastId = toast.loading('Requesting revisions...');
    try {
      await reviewService.requestChanges(yearId, note);
      toast.success('Revisions requested', { id: toastId });
      loadFinancialYears();
    } catch (err: any) {
      toast.error(err.message || 'Action failed', { id: toastId });
    }
  };

  const finalizeYear = async (yearId: string) => {
    if (!window.confirm("Approve and lock this financial year?")) return;
    const toastId = toast.loading('Finalizing...');
    try {
      await reviewService.finalizeReview(yearId);
      toast.success('Finalized and locked', { id: toastId });
      loadFinancialYears();
    } catch (err: any) {
      toast.error(err.message || 'Action failed', { id: toastId });
    }
  };

  const confirmDeleteYear = async () => {
    if (!deleteTarget) return;
    const toastId = toast.loading('Deleting...');
    try {
      await financialYearService.delete(activeCompanyId, deleteTarget.id);
      toast.success('Deleted permanently', { id: toastId });
      setDeleteTarget(null);
      loadFinancialYears();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed', { id: toastId });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#121212] p-8 text-white relative">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-end border-b border-gray-800 pb-6">
          <div>
            <p className="text-sm font-medium text-blue-400 mb-1">Company Dashboard</p>
            <h1 className="text-4xl font-bold tracking-tight">{activeCompany.name}</h1>
          </div>
          <button
            onClick={() => {
              setNewDate(`${new Date().getFullYear()}-06-30`);
              setShowModal(true);
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center"
          >
            <Plus size={18} className="mr-2" /> Start New Year
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                    Loading financial years...
                  </td>
                </tr>
              ) : financialYears.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                    No financial years found. Start a new year to begin auditing.
                  </td>
                </tr>
              ) : (
                financialYears.map((fy) => {
                  const canEdit = !fy.isLocked && fy.reviewStatus !== 'SUBMITTED' && fy.reviewStatus !== 'UNDER_REVIEW';

                  const statusStyles: Record<string, string> = {
                    DRAFT: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
                    SUBMITTED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    UNDER_REVIEW: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                    CHANGES_REQUESTED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    FINALIZED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  };

                  return (
                    <tr key={fy.id} className="hover:bg-[#202020] transition-colors group">
                      <td className="px-6 py-4 font-medium text-white border-b border-gray-800/50">
                        FY {fy.year}
                      </td>
                      <td className="px-6 py-4 text-gray-300 border-b border-gray-800/50">
                        {fy.reportingDate}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-800/50">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[fy.reviewStatus]}`}>
                          {fy.reviewStatus.replace('_', ' ')}
                          {fy.isLocked && <Lock size={10} className="ml-1.5" />}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right border-b border-gray-800/50 space-x-3 flex justify-end items-center">
                        {(fy.reviewStatus === 'DRAFT' || fy.reviewStatus === 'CHANGES_REQUESTED') && currentUser?.role === 'STUDENT' && (
                          <button
                            onClick={() => submitFinancialYear(fy.id)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center"
                          >
                            <Send size={14} className="mr-1" /> Submit
                          </button>
                        )}
                        {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') && (
                          <>
                            {(fy.reviewStatus === 'SUBMITTED' || fy.reviewStatus === 'UNDER_REVIEW') && !fy.isLocked && (
                              <button
                                onClick={() => requestRevisions(fy.id)}
                                className="text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1.5 rounded"
                              >
                                Request Revisions
                              </button>
                            )}
                            {fy.isLocked ? (
                              <span className="text-emerald-500/50 text-xs font-medium flex items-center">
                                <Lock size={12} className="mr-1" /> Finalized
                              </span>
                            ) : (fy.reviewStatus === 'SUBMITTED' || fy.reviewStatus === 'UNDER_REVIEW') && (
                              <button
                                onClick={() => finalizeYear(fy.id)}
                                className="text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-colors border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1.5 rounded flex items-center"
                              >
                                <Check size={12} className="mr-1" /> Approve & Lock
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => handleOpenYear(fy.id)}
                          className="px-4 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-md text-sm font-medium transition-all flex items-center"
                        >
                          {canEdit ? 'Continue' : <><Eye size={14} className="mr-1" /> View</>}
                        </button>
                        {canEdit && fy.reviewStatus === 'DRAFT' && (
                          <button
                            onClick={() => setDeleteTarget({ id: fy.id, year: fy.year })}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all ml-2"
                            title="Delete Financial Year"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
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
            <h3 className="text-xl font-bold mb-2 text-white">Start New Financial Year</h3>
            <p className="text-gray-400 text-sm mb-6">
              A new financial year will copy the previous year's structure as a baseline to prevent redundant data entry.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleCreateYear}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Reporting Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Confirm & Start
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-sm p-6 border border-red-900/50 shadow-2xl shadow-red-900/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Financial Year</h3>
            </div>
            <p className="text-gray-400 text-sm mb-2">Are you sure you want to delete FY {deleteTarget.year}?</p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6 flex space-x-2 items-start mt-4">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs leading-relaxed">
                This action is <strong>irreversible</strong>. All audit data connected will be permanently removed.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteYear}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg shadow-lg shadow-red-600/20 transition-all text-sm flex items-center gap-2"
              >
                <Trash2 size={14} /> Remove Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
