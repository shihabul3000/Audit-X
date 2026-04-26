'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Input Multi-Year Data',
    description: 'Enter your current and prior year balances into a structured interface designed exclusively for financial auditors.',
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
  },
  {
    step: '02',
    title: 'Automated Synchronization',
    description: 'Audit-X automatically saves historical records and ensures data synchronization across PNL, SFP, SCE, and SCF.',
    gradient: 'linear-gradient(135deg, #10b981, #0d9488)',
  },
  {
    step: '03',
    title: 'Rollover to Next Year',
    description: 'Click "Start New Year" to safely shift your current year into history, preserving previous balances without any manual adjustments.',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" style={{ padding: '96px 24px', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative blob */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 64px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Workflow &amp; Process
            </p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 16 }}>
              How Audit-X Works
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.7 }}>
              Simplify complex financial transitions in 3 easy steps.
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, marginBottom: 64 }}>
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: 20,
                background: s.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 28, fontWeight: 900,
                marginBottom: 24,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                outline: '4px solid #fff',
              }}>
                {s.step}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.65 }}>{s.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA card */}
        <div style={{
          background: '#fff', borderRadius: 24, padding: '40px 48px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        }}>
          <div>
            <h4 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>See it in action</h4>
            <p style={{ fontSize: 15, color: '#64748b' }}>Our seamless working dashboard requires zero configuration.</p>
          </div>
          <a
            href="/auth"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#0f172a', color: '#fff',
              padding: '12px 24px', borderRadius: 999,
              fontSize: 15, fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
          >
            <Play size={16} fill="currentColor" /> Watch Walkthrough
          </a>
        </div>
      </div>
    </section>
  );
};
