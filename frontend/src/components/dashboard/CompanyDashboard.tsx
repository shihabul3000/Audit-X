import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Trash2 } from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
  const users = useAppStore(state => state.users);
  const currentUserId = useAppStore(state => state.currentUserId);
  const activeCompanyId = useAppStore(state => state.activeCompanyId);
  const setActiveYear = useAppStore(state => state.setActiveYear);
  const markYearCompleted = useAppStore(state => state.markYearCompleted);
  const startNewYear = useAppStore(state => state.startNewYear);
  const deleteFinancialYear = useAppStore(state => state.deleteFinancialYear);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const currentYear = new Date().getFullYear();
  const [newDate, setNewDate] = useState(`${currentYear}-06-30`);
  const [error, setError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; year: number } | null>(null);

  const currentUser = users.find(u => u.id === currentUserId);
  const activeCompany = currentUser?.companies.find(c => c.id === activeCompanyId);

  if (!activeCompany) {
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
    setActiveYear(yearId);
    navigate('/fs/cover');
  };

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      startNewYear(newDate);
      setShowModal(false);
      setNewDate('');
      // It auto-sets activeYearId to the new year
      navigate('/fs/cover');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const confirmDeleteYear = () => {
    if (deleteTarget) {
      deleteFinancialYear(deleteTarget.id);
      setDeleteTarget(null);
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
              {activeCompany.financialYears.map((fy) => (
                <tr key={fy.id} className="hover:bg-[#202020] transition-colors group">
                  <td className="px-6 py-4 font-medium text-white border-b border-gray-800/50">
                    FY {fy.year}
                  </td>
                  <td className="px-6 py-4 text-gray-300 border-b border-gray-800/50">
                    {fy.reportingDate}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-800/50">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${fy.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                      {fy.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right border-b border-gray-800/50 space-x-3 flex justify-end items-center">
                    {fy.status === 'in-progress' && (
                      <button
                        onClick={() => markYearCompleted(fy.id)}
                        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenYear(fy.id)}
                      className="px-4 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-md text-sm font-medium transition-all"
                    >
                      {fy.status === 'completed' ? 'View/Edit' : 'Continue'}
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: fy.id, year: fy.year })}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all ml-2"
                      title="Delete Financial Year"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {activeCompany.financialYears.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                    No financial years found. Start a new year to begin auditing.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-md p-6 border border-gray-800 shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Start New Financial Year</h3>
            <p className="text-gray-400 text-sm mb-6">
              A new financial year will copy the previous year's structure as a baseline to prevent redundant data entry. Master records are kept isolated.
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-sm p-6 border border-red-900/50 shadow-2xl shadow-red-900/20 animate-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Financial Year</h3>
            </div>
            <p className="text-gray-400 text-sm mb-2">
              Are you sure you want to delete:
            </p>
            <p className="text-white font-semibold text-base mb-4 px-3 py-2 bg-[#2a2a2a] rounded-lg border border-gray-700">
              FY {deleteTarget.year}
            </p>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-xs leading-relaxed">
                ⚠️ This action is <strong>irreversible</strong>. All audit data, notes, and records for this year will be permanently deleted.
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
                <Trash2 size={14} />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
