import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Sidebar: React.FC = () => {
  const users = useAppStore(state => state.users);
  const currentUserId = useAppStore(state => state.currentUserId);
  const currentUser = users.find(u => u.id === currentUserId);

  const activeCompanyId = useAppStore(state => state.activeCompanyId);
  const setActiveCompany = useAppStore(state => state.setActiveCompany);
  const createCompany = useAppStore(state => state.createCompany);
  const updateCompany = useAppStore(state => state.updateCompany);
  const logout = useAppStore(state => state.logout);

  const [isCreating, setIsCreating] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editedCompanyName, setEditedCompanyName] = useState('');

  if (!currentUser) return null;

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompanyName.trim()) {
      createCompany(newCompanyName.trim());
      setNewCompanyName('');
      setIsCreating(false);
    }
  };

  const handleUpdateCompany = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (editedCompanyName.trim()) {
      updateCompany(id, editedCompanyName.trim());
    }
    setEditingCompanyId(null);
  };

  const startEditing = (e: React.MouseEvent, id: string, currentName: string) => {
    e.stopPropagation();
    setEditingCompanyId(id);
    setEditedCompanyName(currentName);
  };

  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col h-full text-white">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Audit-X
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">
            <span>Companies</span>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="text-blue-400 hover:text-blue-300"
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
            {currentUser.companies.map(company => (
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
                    <button type="button" onClick={() => setEditingCompanyId(null)} className="p-1 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded">
                      <X size={14} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setActiveCompany(company.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all focus:outline-none flex justify-between items-center ${activeCompanyId === company.id
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
            {currentUser.companies.length === 0 && !isCreating && (
              <p className="text-gray-500 text-sm text-center py-4 italic">No companies yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800 bg-[#161616]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
