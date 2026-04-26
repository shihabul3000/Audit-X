/**
 * Example tests for Navbar href preservation
 * Feature: ui-redesign, Property 4: Landing page hrefs are preserved (Navbar)
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const navbarPath = resolve(__dirname, '../../src/components/landing/Navbar.tsx');
const navbar = readFileSync(navbarPath, 'utf-8');

// Feature: ui-redesign, Property 4: Landing page hrefs are preserved (Navbar)
describe('Property 4: Landing page hrefs are preserved (Navbar)', () => {
  it('Navbar should preserve href="/auth" for Get Started CTA', () => {
    expect(navbar).toContain('href="/auth"');
  });

  it('Navbar should preserve href="#features" anchor link', () => {
    expect(navbar).toContain('href="#features"');
  });

  it('Navbar should preserve href="#how-it-works" anchor link', () => {
    expect(navbar).toContain('href="#how-it-works"');
  });
});
