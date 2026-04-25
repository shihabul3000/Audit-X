'use client';
import React from 'react';
import { motion } from 'motion/react';
import { History, LayoutDashboard, ShieldCheck, Zap } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <History className="text-indigo-500" size={24} />,
      title: 'Multi-Year Financial History',
      description: 'Store and access unlimited historical records natively. Instantly view past years without losing the context of your current work.',
      bg: 'bg-indigo-50 border-indigo-100',
    },
    {
      icon: <Zap className="text-amber-500" size={24} />,
      title: 'Dynamic Rollover Engine',
      description: 'Start a new financial year with a single click. The system safely migrates prior year data and resets current balances instantly.',
      bg: 'bg-amber-50 border-amber-100',
    },
    {
      icon: <LayoutDashboard className="text-emerald-500" size={24} />,
      title: 'Seamless Reporting',
      description: 'Automatically generate perfectly formatted Statements of Financial Position (SFP) and Profit & Loss (PNL) from your working data.',
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      icon: <ShieldCheck className="text-rose-500" size={24} />,
      title: 'Zero Data Loss',
      description: 'Built with idempotent rules and safe history synchronization ensuring that your sensitive financial data is never overwritten.',
      bg: 'bg-rose-50 border-rose-100',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-2">Powerful Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Enterprise-Grade Auditing</h3>
            <p className="text-lg text-slate-600">
              Audit-X provides a structured, predictable, and fully automated experience for managing complex financial statements over multiple years.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 rounded-2xl border ${feature.bg} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}
            >
              <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-6 border border-slate-100 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

