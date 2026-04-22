import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, Play } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Input Multi-Year Data',
      description: 'Enter your current and prior year balances into a structured interface designed exclusively for financial auditors.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      step: '02',
      title: 'Automated Synchronization',
      description: 'Audit-X automatically saves historical records and ensures data synchronization across PNL, SFP, SCE, and SCF.',
      color: 'from-emerald-400 to-teal-600'
    },
    {
      step: '03',
      title: 'Rollover to Next Year',
      description: 'Click "Start New Year" to safely shift your current year into history, preserving previous balances without any manual adjustments.',
      color: 'from-amber-400 to-orange-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-2">Workflow & Process</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Audit-X Works</h3>
            <p className="text-lg text-slate-600">
              Simplify complex financial transitions in 3 easy steps.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left relative">
          {/* Connecting Line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center sm:items-start group"
            >
              <div className={`w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg shadow-slate-300/50 flex items-center justify-center text-white text-3xl font-black transform group-hover:-translate-y-2 transition-transform duration-300 ring-4 ring-white`}>
                {step.step}
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h4>
              <p className="text-slate-600 leading-relaxed sm:pr-8">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 pt-16 border-t border-slate-200">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
               <h4 className="text-2xl font-bold text-slate-900 mb-3">See it in action</h4>
               <p className="text-slate-600">Our seamless working dashboard requires zero configuration.</p>
            </div>
            <a href="/dashboard" className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold transition-colors shrink-0">
               <Play size={18} fill="currentColor" /> Watch Walkthrough
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
