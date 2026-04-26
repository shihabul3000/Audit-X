'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#020617', padding: '64px 24px 32px', borderTop: '1px solid #1e293b' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ background: '#6366f1', color: '#fff', padding: 4, borderRadius: 6, display: 'flex' }}>
                <ShieldCheck size={18} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>
                Audit<span style={{ color: '#818cf8' }}>-X</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, maxWidth: 320 }}>
              A premium financial workspace for auditors and accountants to generate multi-year reporting, robust rollovers, and perfectly formatted SFPs.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Features', href: '#features' },
                { label: 'How it works', href: '#how-it-works' },
                { label: 'Dashboard', href: '/auth' },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: 12 }}>
                  <a href={item.href} style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Privacy Policy', 'Terms of Service', 'Contact Support'].map((item) => (
                <li key={item} style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 14, color: '#334155', cursor: 'not-allowed' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <p style={{ fontSize: 12, color: '#334155' }}>
            &copy; {new Date().getFullYear()} Audit-X Software. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {['in', 'X'].map((s) => (
              <span key={s} style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#0f172a', border: '1px solid #1e293b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#64748b', fontWeight: 600,
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
