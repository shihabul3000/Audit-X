/**
 * Example tests for HeroSection href preservation
 * Feature: ui-redesign, Property 4: Landing page hrefs are preserved (HeroSection)
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const heroPath = resolve(__dirname, '../../src/components/landing/HeroSection.tsx');
const hero = readFileSync(heroPath, 'utf-8');

// Feature: ui-redesign, Property 4: Landing page hrefs are preserved (HeroSection)
describe('Property 4: Landing page hrefs are preserved (HeroSection)', () => {
  it('HeroSection should preserve href="/dashboard"', () => {
    expect(hero).toContain('href="/dashboard"');
  });

  it('HeroSection should preserve href="#features"', () => {
    expect(hero).toContain('href="#features"');
  });
});
