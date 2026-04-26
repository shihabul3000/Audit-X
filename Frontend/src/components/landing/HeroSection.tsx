'use client';
import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { FileSpreadsheet, ArrowRight, Activity, ArrowUpRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section
      style={{
        position: 'relative',
        paddingTop: '120px',
        paddingBottom: '80px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #f8faff 50%, #f0fff4 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 80, left: 0, width: 400, height: 400, background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Text content — centered */}
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 999,
              fontSize: 12, fontWeight: 600, color: '#4338ca',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            }}>
              <Activity size={13} style={{ color: '#6366f1' }} />
              V2.0 Now Available with Multi-Year Architecture
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Modernize Your{' '}
            <span style={{
              background: 'linear-gradient(90deg, #6366f1, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Financial Reporting
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: 18,
              color: '#475569',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto 40px',
            }}
          >
            A smart, unified workspace for complex financial audits. Generate perfectly formatted SFP &amp; PNL reports, manage unlimited historical records, and execute instant dual-year rollovers with zero data loss.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 0 }}
          >
            <Link
              href="/auth"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#6366f1', color: '#fff',
                padding: '14px 32px', borderRadius: 999,
                fontSize: 16, fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                transition: 'all 0.2s',
              }}
            >
              Start Auditing
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#fff', color: '#334155',
                padding: '14px 32px', borderRadius: 999,
                fontSize: 16, fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
              }}
            >
              Explore Features
              <ArrowUpRight size={18} style={{ color: '#94a3b8' }} />
            </a>
          </motion.div>
        </div>

        {/* Mockup card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            marginTop: 64,
            maxWidth: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 16,
            border: '1px solid rgba(226,232,240,0.8)',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 24px 64px rgba(99,102,241,0.12), 0 4px 16px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Window chrome */}
          <div style={{
            background: 'rgba(241,245,249,0.9)',
            borderBottom: '1px solid #e2e8f0',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f87171' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#34d399' }} />
            <div style={{ marginLeft: 16, fontSize: 11, fontWeight: 600, color: '#94a3b8', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>
              <FileSpreadsheet size={11} /> Audit-X Dashboard
            </div>
          </div>
          {/* Mock content */}
          <div style={{ background: '#f8fafc', padding: 24, minHeight: 280 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
              <div>
                <div style={{ height: 18, width: 180, background: '#e2e8f0', borderRadius: 6, marginBottom: 8, animation: 'pulse 2s infinite' }} />
                <div style={{ height: 12, width: 120, background: '#f1f5f9', borderRadius: 4 }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ height: 32, width: 90, background: '#e0e7ff', borderRadius: 8 }} />
                <div style={{ height: 32, width: 40, background: '#d1fae5', borderRadius: 8 }} />
              </div>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', background: '#fff',
                border: '1px solid #f1f5f9', borderRadius: 10,
                marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 14, height: 14, background: '#f1f5f9', borderRadius: 3 }} />
                  <div style={{ width: 120, height: 14, background: '#e2e8f0', borderRadius: 4 }} />
                </div>
                <div style={{ display: 'flex', gap: 32 }}>
                  <div style={{ width: 60, height: 14, background: '#f1f5f9', borderRadius: 4 }} />
                  <div style={{ width: 60, height: 14, background: '#f1f5f9', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
