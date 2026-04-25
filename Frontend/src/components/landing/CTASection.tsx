'use client';
import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 bg-indigo-900 border-t border-slate-100 overflow-hidden">

      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-30 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 mb-6">
            <Sparkles size={14} /> Built for Professional Auditors
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Ready to simplify your <br className="hidden md:block" /> financial audits?
          </h2>

          <p className="text-lg text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of financial professionals managing multi-year records effortlessly. Start using Audit-X today and experience the rollover engine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-4 rounded-full text-base font-bold shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Get Started Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
