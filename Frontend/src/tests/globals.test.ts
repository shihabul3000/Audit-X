/**
 * Example tests for globals.css design tokens
 * Feature: ui-redesign
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const cssPath = resolve(__dirname, '../../src/app/globals.css');
const css = readFileSync(cssPath, 'utf-8');

// Feature: ui-redesign, Property 1: CSS design tokens are defined
describe('Property 1: CSS design tokens are defined', () => {
  it('globals.css should define all required Carbon & Cobalt surface color tokens', () => {
    expect(css).toContain('--color-bg-base');
    expect(css).toContain('--color-bg-surface');
    expect(css).toContain('--color-bg-elevated');
    expect(css).toContain('--color-bg-overlay');
    expect(css).toContain('--color-bg-subtle');
  });

  it('globals.css should define brand color tokens', () => {
    expect(css).toContain('--color-brand-primary');
  });

  it('globals.css should define text color tokens', () => {
    expect(css).toContain('--color-text-primary');
    expect(css).toContain('--color-text-secondary');
  });

  it('globals.css should define sidebar color tokens', () => {
    expect(css).toContain('--color-sidebar-bg');
  });

  it('globals.css should define border color tokens', () => {
    expect(css).toContain('--color-border');
  });

  it('globals.css should define status color tokens', () => {
    expect(css).toContain('--color-status-');
  });
});

// Feature: ui-redesign, Property 2: Font imports are present
describe('Property 2: Font imports are present', () => {
  it('globals.css should import DM Sans from Google Fonts', () => {
    expect(css).toContain('DM+Sans');
  });

  it('globals.css should import JetBrains Mono from Google Fonts', () => {
    expect(css).toContain('JetBrains+Mono');
  });

  it('globals.css should use a Google Fonts @import URL', () => {
    expect(css).toContain('fonts.googleapis.com');
  });
});

// Feature: ui-redesign, Property 3: Utility classes are defined
describe('Property 3: Utility classes are defined', () => {
  it('globals.css should define .glass-card utility class', () => {
    expect(css).toContain('.glass-card');
  });

  it('globals.css should define .gradient-text utility class', () => {
    expect(css).toContain('.gradient-text');
  });

  it('globals.css should define .btn-brand utility class', () => {
    expect(css).toContain('.btn-brand');
  });

  it('globals.css should define .noise-overlay utility class', () => {
    expect(css).toContain('.noise-overlay');
  });
});
