/**
 * Example tests for CTASection and Footer href preservation
 * Feature: ui-redesign, Property 4: Landing page hrefs are preserved (CTASection, Footer)
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const ctaPath = resolve(__dirname, '../../src/components/landing/CTASection.tsx');
const footerPath = resolve(__dirname, '../../src/components/landing/Footer.tsx');
const cta = readFileSync(ctaPath, 'utf-8');
const footer = readFileSync(footerPath, 'utf-8');

// Feature: ui-redesign, Property 4: Landing page hrefs are preserved (CTASection)
describe('Property 4: Landing page hrefs are preserved (CTASection)', () => {
  it('CTASection should preserve href="/dashboard"', () => {
    expect(cta).toContain('href="/dashboard"');
  });
});

// Feature: ui-redesign, Property 4: Landing page hrefs are preserved (Footer)
describe('Property 4: Landing page hrefs are preserved (Footer)', () => {
  it('Footer should preserve href="#features"', () => {
    expect(footer).toContain('href="#features"');
  });

  it('Footer should preserve href="#how-it-works"', () => {
    expect(footer).toContain('href="#how-it-works"');
  });

  it('Footer should preserve href="/dashboard"', () => {
    expect(footer).toContain('href="/dashboard"');
  });
});
