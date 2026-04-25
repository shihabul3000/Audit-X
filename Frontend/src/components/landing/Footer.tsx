import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 opacity-90">
              <div className="bg-indigo-600 text-white p-1 rounded-md">
                <ShieldCheck size={20} />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Audit<span className="text-indigo-400">-X</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A premium financial workspace for auditors and accountants to generate multi-year reporting, robust rollovers, and perfectly formatted SFPs.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-wider">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How it works</a></li>
              <li><a href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 uppercase text-xs tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-slate-500 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="text-sm text-slate-500 cursor-not-allowed">Terms of Service</span></li>
              <li><span className="text-sm text-slate-500 cursor-not-allowed">Contact Support</span></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Audit-X Software. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">in</span>
            <span className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">X</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
