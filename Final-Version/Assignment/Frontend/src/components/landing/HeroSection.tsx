'use client';
import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { FileSpreadsheet, ArrowRight, Activity, ArrowUpRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 min-h-[90vh] flex items-center">

      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-[600px] w-full blur-3xl opacity-30 pointer-events-none mix-blend-multiply">
        <div className="absolute right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply blur-3xl opacity-50 animate-pulse transition-all"></div>
        <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-emerald-400 rounded-full mix-blend-multiply blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700 bg-indigo-100/80 border border-indigo-200">
              <Activity size={14} className="text-indigo-600" /> V2.0 Now Available with Multi-Year Architecture
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8"
          >
            Modernize Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">
              Financial Reporting
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A smart, unified workspace for complex financial audits. Generate perfectly formatted SFP & PNL reports, manage unlimited historical records, and execute instant dual-year rollovers with zero data loss.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-base font-bold shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Start Auditing
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 px-8 py-4 rounded-full text-base font-semibold shadow-sm transition-all hover:bg-slate-50"
            >
              Explore Features
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </a>
          </motion.div>

        </div>

        {/* Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 mx-auto max-w-5xl rounded-2xl border bg-white/50 backdrop-blur-xl border-slate-200/60 shadow-2xl overflow-hidden shadow-indigo-100/50 relative"
        >
          {/* Mac window header */}
          <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <div className="ml-4 text-xs font-semibold text-slate-400 font-mono flex items-center gap-1">
              <FileSpreadsheet size={12} /> Audit-X Dashboard
            </div>
          </div>
          {/* Mock content representation */}
          <div className="h-[250px] md:h-[400px] w-full bg-slate-50 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div className="space-y-2">
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-slate-100 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-indigo-100 rounded"></div>
                <div className="h-8 w-10 bg-emerald-100 rounded"></div>
              </div>
            </div>

            {/* Fake table rows */}
            <div className="space-y-3 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 shadow-sm rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-slate-100 rounded-sm"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  </div>
                  <div className="flex gap-8">
                    <div className="h-4 w-16 bg-slate-100 rounded"></div>
                    <div className="h-4 w-16 bg-slate-100 rounded"></div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <div className="h-px w-48 bg-slate-300"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
