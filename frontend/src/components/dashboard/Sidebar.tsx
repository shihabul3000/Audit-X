import React, { useState, useEffect } from 'react';
import { Pencil, Check, X, Bell } from 'lucide-react';
import { useAppStore, authSelectors, permissionSelectors } from '../../store/useAppStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { companyService } from '../../services/company.service';
import { notificationService } from '../../services/notification.service';
import toast from 'react-hot-toast';

export const Sidebar: React.FC = () => {
  const currentUser = useAppStore(authSelectors.getCurrentUser);
  const allCompanies = useAppStore(state => state.companies);

  const activeCompanyId = useAppStore(state => state.activeCompanyId);
  const setActiveCompany = useAppStore(state => state.setActiveCompany);
  const fetchCompanies = useAppStore(state => state.fetchCompanies);
  const logout = useAppStore(state => state.logout);

  const navigate = useNavigate();
  const location = useLocation();

  const [isCreating, setIsCreating] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editedCompanyName, setEditedCompanyName] = useState('');
  
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkUnread = async () => {
      try {
        const res = await notificationService.getUnreadCount();
        setUnreadCount(res.data.count);
      } catch (err) {
        // silently fail
      }
    };
    checkUnread();
    
    // Optional: poll every 60s
    const interval = setInterval(checkUnread, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!currentUser) return null;

  const visibleCompanies = allCompanies.filter(c => permissionSelectors.canAccessCompany(currentUser, c));

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    const toastId = toast.loading('Creating company...');
    try {
      await companyService.create(newCompanyName.trim());
      setIsCreating(false);
      setNewCompanyName('');
      await fetchCompanies();
      toast.success('Company created', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create company', { id: toastId });
    }
  };

  const handleUpdateCompany = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editedCompanyName.trim()) return;
    const toastId = toast.loading('Updating...');
    try {
      await companyService.update(id, editedCompanyName.trim());
      setEditingCompanyId(null);
      await fetchCompanies();
      toast.success('Updated successfully', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update', { id: toastId });
    }
  };

  const startEditing = (e: React.MouseEvent, id: string, currentName: string) => {
    e.stopPropagation();
    setEditingCompanyId(id);
    setEditedCompanyName(currentName);
  };

  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col h-full text-white">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Audit-X
        </h2>
        <div className="relative cursor-pointer hover:bg-gray-800 p-2 rounded-full transition-colors" title="Notifications">
          <Bell size={18} className="text-gray-400 hover:text-white" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div>
          {currentUser.role !== 'STUDENT' && (
            <div className="mb-8 space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Management</div>
              <button
                onClick={() => navigate('/dashboard/my-companies')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all focus:outline-none ${location.pathname.includes('/my-companies') ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
              >
                My assigned companies
              </button>
              <button
                onClick={() => navigate('/dashboard/admin')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all focus:outline-none ${location.pathname.includes('/admin') ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
              >
                Firm Operations (Admin)
              </button>
              {currentUser.role === 'SUPER_ADMIN' && (
                <button
                  onClick={() => navigate('/dashboard/system')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all focus:outline-none ${location.pathname.includes('/system') ? 'bg-red-600/20 text-red-400 font-medium border border-red-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                >
                  System Config (Super Admin)
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">
            <span>Companies</span>
            <button
              onClick={() => {
                 navigate('/dashboard/my-companies');
                 setIsCreating(!isCreating);
              }}
              className="text-blue-400 hover:text-blue-300 px-2 text-lg font-normal"
            >
              +
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreateCompany} className="mb-4">
              <input
                type="text"
                autoFocus
                value={newCompanyName}
                onChange={e => setNewCompanyName(e.target.value)}
                onBlur={() => setIsCreating(false)}
                placeholder="Company Name..."
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </form>
          )}

          <div className="space-y-1">
            {visibleCompanies.map(company => (
              <div
                key={company.id}
                className="group relative"
              >
                {editingCompanyId === company.id ? (
                  <form
                    onSubmit={e => handleUpdateCompany(e, company.id)}
                    className="flex items-center w-full bg-[#2a2a2a] border border-blue-500 rounded-lg p-1"
                  >
                    <input
                      type="text"
                      autoFocus
                      value={editedCompanyName}
                      onChange={e => setEditedCompanyName(e.target.value)}
                      className="flex-1 px-2 py-1.5 bg-transparent text-sm text-white focus:outline-none"
                    />
                    <button type="submit" className="p-1 text-emerald-400 hover:bg-white/10 rounded">
                      <Check size={14} />
                    </button>
                    <button type="button" onMouseDown={() => setEditingCompanyId(null)} className="p-1 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded">
                      <X size={14} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                        setActiveCompany(company.id);
                        navigate('/dashboard/my-companies');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none flex justify-between items-center ${activeCompanyId === company.id && location.pathname.includes('/my-companies')
                      ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20'
                      : 'text-gray-300 hover:bg-[#2a2a2a]'
                      }`}
                  >
                    <span className="truncate">{company.name}</span>
                    <div
                      onClick={(e) => startEditing(e, company.id, company.name)}
                      className={`p-1.5 rounded-md hover:bg-white/20 transition-all ${activeCompanyId === company.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      title="Edit Company Name"
                    >
                      <Pencil size={14} />
                    </div>
                  </button>
                )}
              </div>
            ))}
            {visibleCompanies.length === 0 && !isCreating && (
              <p className="text-gray-500 text-sm text-center py-4 italic">No companies yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800 bg-[#161616]">
        <div className="flex items-center space-x-3 mb-4 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors" onClick={() => navigate('/dashboard/profile')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-400 flex items-center space-x-2">
               <span className="truncate">{currentUser.email}</span>
               <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/20 text-blue-400">
                 {currentUser.role.replace('_', ' ')}
               </span>
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full py-2 text-sm text-red-400 hover:text-red-300 border border-red-500/20 bg-red-400/10 rounded-lg transition-colors font-medium mt-2"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
