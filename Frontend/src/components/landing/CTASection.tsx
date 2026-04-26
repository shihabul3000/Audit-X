'use client';
import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section id="cta" style={{ padding: '96px 24px', background: '#312e81', position: 'relative', overflow: 'hidden' }}>
      {/* Blur orbs */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 999,
            fontSize: 12, fontWeight: 600, color: '#34d399',
            background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
            marginBottom: 24,
          }}>
            <Sparkles size={13} /> Built for Professional Auditors
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800, color: '#fff',
            letterSpacing: '-0.02em', lineHeight: 1.2,
            marginBottom: 20,
          }}>
            Ready to simplify your financial audits?
          </h2>

          <p style={{ fontSize: 17, color: '#c7d2fe', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
            Join thousands of financial professionals managing multi-year records effortlessly. Start using Audit-X today and experience the rollover engine.
          </p>

          <Link
            href="/auth"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#10b981', color: '#0f172a',
              padding: '16px 40px', borderRadius: 999,
              fontSize: 16, fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
              transition: 'all 0.2s',
            }}
          >
            Get Started Now
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
