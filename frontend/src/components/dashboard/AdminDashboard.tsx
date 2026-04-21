import React, { useState } from 'react';
import { useAppStore, authSelectors } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const users = useAppStore(state => state.users);
  const currentUser = useAppStore(authSelectors.getCurrentUser);
  const companies = useAppStore(state => state.companies);
  const assignCompanyToUser = useAppStore(state => state.assignCompanyToUser);
  const unassignCompanyFromUser = useAppStore(state => state.unassignCompanyFromUser);
  const navigate = useNavigate();

  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) return null;

  const students = users.filter(u => u.role === 'STUDENT');

  return (
    <div className="flex-1 bg-[#121212] p-8 overflow-y-auto text-white">
      <h2 className="text-3xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Firm Management</h2>
      <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-lg border border-gray-800">
        <h3 className="text-xl font-semibold mb-4 text-gray-300">Student Assignments</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-sm">
              <th className="pb-3">Student Name</th>
              <th className="pb-3">Assigned Companies</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-b border-gray-800/50">
                <td className="py-3 font-medium">{s.name} <span className="text-gray-500 block text-xs">{s.email}</span></td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {s.assignedCompanyIds.map(cid => {
                        const cName = companies.find(c => c.id === cid)?.name || 'Unknown';
                        return (
                           <span key={cid} className="px-2 py-1 bg-blue-900/40 text-blue-300 text-xs rounded-full border border-blue-800/50 flex items-center group">
                              <button 
                                onClick={() => {
                                   useAppStore.getState().setActiveCompany(cid);
                                   navigate('/dashboard/my-companies');
                                }}
                                className="hover:text-white transition-colors cursor-pointer"
                                title="View Company"
                              >
                                {cName}
                              </button>
                              <button onClick={() => unassignCompanyFromUser(s.id, cid)} className="ml-1.5 text-red-400 hover:text-red-300 opacity-50 group-hover:opacity-100 transition-opacity">×</button>
                           </span>
                        )
                    })}
                  </div>
                  <select 
                     className="bg-black border border-gray-700 rounded px-2 py-1 outline-none text-xs w-48"
                     onChange={(e) => {
                        if (e.target.value) {
                           assignCompanyToUser(s.id, e.target.value);
                           e.target.value = '';
                        }
                     }}
                     defaultValue=""
                  >
                     <option value="" disabled>Assign new company...</option>
                     {companies.filter(c => !s.assignedCompanyIds.includes(c.id)).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                  </select>
                </td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan={2} className="py-4 text-center text-gray-500">No students found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
