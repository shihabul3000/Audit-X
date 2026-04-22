import React, { useState, useEffect } from 'react';
import { useAppStore, authSelectors } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { companyService } from '../../services/company.service';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const currentUser = useAppStore(authSelectors.getCurrentUser);
  const companies = useAppStore(state => state.companies);
  const navigate = useNavigate();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await userService.getUsers('STUDENT');
        setStudents(res.data.data || []);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) return null;

  return (
    <div className="flex-1 bg-[#121212] p-8 overflow-y-auto text-white">
      <h2 className="text-3xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Firm Management</h2>
      <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-lg border border-gray-800">
        <h3 className="text-xl font-semibold mb-4 text-gray-300">Student Assignments</h3>
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Loading students...
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-sm">
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b border-gray-800/50">
                  <td className="py-3 font-medium">{s.name}</td>
                  <td className="py-3 text-gray-400">{s.email}</td>
                  <td className="py-3">
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${s.status === 'ACTIVE' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={3} className="py-4 text-center text-gray-500">No students found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
