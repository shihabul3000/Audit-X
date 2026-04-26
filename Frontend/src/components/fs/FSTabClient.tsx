'use client';

import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, Send, Lock, Unlock, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuditDataAPI } from '@/hooks/useAuditDataAPI';
import { useGlobalStoreSync } from '@/hooks/useGlobalStoreSync';
import { NavigationNew } from './NavigationNew';
import { Cover } from '@/components/tabs/Cover';
import { SFP } from '@/components/tabs/SFP';
import { PNL } from '@/components/tabs/PNL';
import { SCE } from '@/components/tabs/SCE';
import { SCF } from '@/components/tabs/SCF';
import { N4_13 } from '@/components/tabs/N4_13';
import { PPE } from '@/components/tabs/PPE';
import { P_Discussion } from '@/components/tabs/P_Discussion';
import { authService } from '@/services/api/auth.service';
import { financialYearService } from '@/services/api/financialYear.service';
import { useUIStore } from '@/store/useUIStore';
import type { Tab } from '@/types';

interface FSTabClientProps {
  tab: string;
}

const TABS: Tab[] = ['Cover', 'SFP', 'PNL', 'SCE', 'SCF', 'P_Discussion', 'N4-13', 'PPE'];

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted for Review',
  UNDER_REVIEW: 'Under Review',
  CHANGES_REQUESTED: 'Changes Requested',
  FINALIZED: 'Finalized',
};

export function FSTabClient({ tab }: FSTabClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { activeYearId } = useUIStore();
  const { data, notesData, financialYear, isLoaded, updateData, updateNotesData } = useAuditDataAPI();
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: authService.getMe });

  const activeTab = (TABS.find(t => t.toLowerCase() === tab?.toLowerCase()) || 'Cover') as Tab;
  const isLocked = financialYear?.isLocked ?? false;
  const reviewStatus = financialYear?.reviewStatus ?? 'DRAFT';

  const canEdit = (() => {
    if (!user || isLocked) return false;
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true;
    if (user.role === 'STUDENT') {
      return reviewStatus === 'DRAFT' || reviewStatus === 'CHANGES_REQUESTED';
    }
    return false;
  })();

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isStudent = user?.role === 'STUDENT';

  const submitMutation = useMutation({
    mutationFn: () => financialYearService.submitYear(activeYearId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['year-data', activeYearId] });
      toast.success('Submitted for review!');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to submit';
      toast.error(msg);
    },
  });

  const reviewActionMutation = useMutation({
    mutationFn: ({ action, note }: { action: string; note?: string }) =>
      financialYearService.reviewAction(activeYearId!, action, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['year-data', activeYearId] });
      toast.success('Action performed');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Action failed';
      toast.error(msg);
    },
  });

  // Sync PPE data to notes store whenever audit data changes
  useGlobalStoreSync(data, notesData, updateNotesData);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#0f1117] text-white font-serif">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4f7df7] mx-auto mb-4" />
          <p className="text-xl">Loading Audit Report Data...</p>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    // Use empty default data if not yet loaded (new financial year)
    const tabData = data ?? {
      company: '', addr: '', date: '', reportingDate: '', startDate: '',
      ppe: { assets: [], headerInfo: { reportTitle: '', annexure: '', asAtDate: '', yearStart: '', yearEnd: '' }, prevYearData: { costOpening: '', costAddition: '', costDisposal: '', depOpening: '', depCharged: '', depAdjustment: '' }, breakdown: { adminExpense: '0', costOfSalesLabel: '', adminExpenseLabel: '' } },
      discussionData: { docStatuses: {}, values: {} },
    };
    switch (activeTab) {
      case 'Cover': return <Cover data={tabData} onUpdate={updateData} />;
      case 'SFP': return <SFP data={tabData} />;
      case 'PNL': return <PNL data={tabData} />;
      case 'SCE': return <SCE data={tabData} />;
      case 'SCF': return <SCF data={tabData} />;
      case 'P_Discussion': return <P_Discussion data={tabData} onUpdate={updateData} />;
      case 'N4-13': return <N4_13 data={tabData} />;
      case 'PPE': return <PPE data={tabData} onUpdate={updateData} />;
      default: return <div className="flex items-center justify-center h-full text-white">Tab not found</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#1a1f2e] overflow-hidden font-sans">
      {/* Status / Read-only banner */}
      {!canEdit && financialYear && (
        <div className="bg-amber-500/15 border-b border-amber-500/25 text-amber-300 px-4 py-2 text-sm font-semibold flex items-center justify-center z-50 shrink-0">
          <AlertCircle size={16} className="mr-2" />
          {isLocked
            ? 'This financial year is locked and finalized. Editing is disabled.'
            : `This financial year is marked as ${STATUS_LABELS[reviewStatus] ?? reviewStatus}. Editing is disabled.`}
        </div>
      )}

      {/* Review action bar — shown inside FS pages for quick access */}
      {financialYear && (
        <div className="bg-[#0d1018]/95 border-b border-white/[0.07] px-4 py-2 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-semibold border ${
              reviewStatus === 'DRAFT' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
              reviewStatus === 'SUBMITTED' ? 'bg-[#4f7df7]/10 text-[#4f7df7] border-[#4f7df7]/20' :
              reviewStatus === 'UNDER_REVIEW' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
              reviewStatus === 'CHANGES_REQUESTED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {isLocked && <Lock size={10} className="inline mr-1" />}
              {STATUS_LABELS[reviewStatus] ?? reviewStatus}
            </span>
            <span className="text-[#8a9ab5] text-xs font-mono">FY {financialYear.year}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Student: submit button */}
            {isStudent && (reviewStatus === 'DRAFT' || reviewStatus === 'CHANGES_REQUESTED') && canEdit && (
              <button
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all"
              >
                <Send size={12} /> Submit for Review
              </button>
            )}

            {/* Admin: review actions */}
            {isAdmin && reviewStatus === 'SUBMITTED' && (
              <button
                onClick={() => reviewActionMutation.mutate({ action: 'start_review' })}
                disabled={reviewActionMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all"
              >
                <Eye size={12} /> Start Review
              </button>
            )}
            {isAdmin && (reviewStatus === 'SUBMITTED' || reviewStatus === 'UNDER_REVIEW') && !isLocked && (
              <>
                <button
                  onClick={() => reviewActionMutation.mutate({ action: 'request_changes' })}
                  disabled={reviewActionMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all"
                >
                  Request Changes
                </button>
                <button
                  onClick={() => reviewActionMutation.mutate({ action: 'finalize' })}
                  disabled={reviewActionMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all"
                >
                  <Lock size={12} /> Finalize & Lock
                </button>
              </>
            )}
            {isAdmin && isLocked && (
              <button
                onClick={() => reviewActionMutation.mutate({ action: 'reopen' })}
                disabled={reviewActionMutation.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all"
              >
                <Unlock size={12} /> Reopen
              </button>
            )}

            <button
              onClick={() => router.push('/dashboard/my-companies')}
              className="px-3 py-1.5 text-[#8a9ab5] hover:text-white text-xs border border-white/[0.07] hover:border-white/20 rounded-lg transition-all"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Main tab content */}
      <main className="flex-1 relative overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`h-full w-full ${!canEdit ? 'pointer-events-none' : ''}`}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      <NavigationNew tabs={TABS} activeTab={activeTab} />
    </div>
  );
}
