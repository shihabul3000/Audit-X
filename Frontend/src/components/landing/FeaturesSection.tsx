'use client';
import React from 'react';
import { motion } from 'motion/react';
import { History, LayoutDashboard, ShieldCheck, Zap } from 'lucide-react';

const features = [
  {
    icon: <History size={24} style={{ color: '#6366f1' }} />,
    title: 'Multi-Year Financial History',
    description: 'Store and access unlimited historical records natively. Instantly view past years without losing the context of your current work.',
    accent: '#eef2ff',
    border: '#c7d2fe',
  },
  {
    icon: <Zap size={24} style={{ color: '#f59e0b' }} />,
    title: 'Dynamic Rollover Engine',
    description: 'Start a new financial year with a single click. The system safely migrates prior year data and resets current balances instantly.',
    accent: '#fffbeb',
    border: '#fde68a',
  },
  {
    icon: <LayoutDashboard size={24} style={{ color: '#10b981' }} />,
    title: 'Seamless Reporting',
    description: 'Automatically generate perfectly formatted Statements of Financial Position (SFP) and Profit & Loss (PNL) from your working data.',
    accent: '#ecfdf5',
    border: '#a7f3d0',
  },
  {
    icon: <ShieldCheck size={24} style={{ color: '#f43f5e' }} />,
    title: 'Zero Data Loss',
    description: 'Built with idempotent rules and safe history synchronization ensuring that your sensitive financial data is never overwritten.',
    accent: '#fff1f2',
    border: '#fecdd3',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" style={{ padding: '96px 24px', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 64px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Powerful Capabilities
            </p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 16 }}>
              Enterprise-Grade Auditing
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.7 }}>
              Audit-X provides a structured, predictable, and fully automated experience for managing complex financial statements over multiple years.
            </p>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                padding: 32,
                borderRadius: 20,
                background: f.accent,
                border: `1px solid ${f.border}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24, boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
