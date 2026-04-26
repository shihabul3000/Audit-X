'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ background: '#6366f1', color: '#fff', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }}>
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: '#1e293b', letterSpacing: '-0.02em' }}>
              Audit<span style={{ color: '#6366f1' }}>-X</span>
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="#features" style={{ fontSize: 14, fontWeight: 500, color: '#475569', textDecoration: 'none' }}>Features</a>
            <a href="#how-it-works" style={{ fontSize: 14, fontWeight: 500, color: '#475569', textDecoration: 'none' }}>How it Works</a>
          </div>

          {/* CTA */}
          <Link
            href="/auth"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#0f172a', color: '#fff',
              padding: '10px 20px', borderRadius: 999,
              fontSize: 14, fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'background 0.2s',
            }}
          >
            Launch App
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </nav>
  );
};
