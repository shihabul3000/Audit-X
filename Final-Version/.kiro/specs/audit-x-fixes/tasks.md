# Implementation Plan: Audit-X Bug Fixes

## Overview

Assignment ফোল্ডারের প্রজেক্টে Prototype-এর সাথে functional parity আনার জন্য নির্দিষ্ট bug fixes।

## Tasks

- [x] 1. Fix useAuditDataAPI null guard issues
  - `updateNotesData`: `!yearData?.notesData` check সরিয়ে `getDefaultNotesData()` fallback দাও
  - `updateData`: `!yearData?.auditData` check সরিয়ে `getDefaultAuditData()` fallback দাও
  - `getDefaultAuditData()` helper function তৈরি করো
  - _Requirements: 1.2, 2.2_

- [x] 2. Fix useGlobalStoreSync to work with null notesData
  - `if (!notesData || !data) return;` guard সরাও
  - notesData null হলে `getDefaultNotesData()` দিয়ে initialize করো
  - sync-এর পরে `recalculate(draft)` call করো
  - _Requirements: 1.3, 3.1, 3.2, 3.3_

- [x] 3. Fix N4_13 store recalculate() completeness
  - `addRow`, `deleteRow`, `updateRowLabel` action-এ `recalculate(draft)` যোগ করো
  - `addTableItem`, `updateTableItem`, `deleteTableItem` action-এ `recalculate(draft)` যোগ করো
  - `updateConfig` action-এ `recalculate(draft)` যোগ করো
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 4. Fix N4_13 data load — merge with initial sections
  - `useStore` hook-এ: loaded notesData.sections-এ missing sections merge করো buildInitialSections() থেকে
  - data load হওয়ার পরে একবার recalculate() run করো
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 5. Checkpoint — সব tabs test করো
  - নতুন financial year তৈরি করে Cover, PPE, N4_13 সব tab-এ data enter করো
  - PPE-তে value দিলে N4_13-এ Note04-এ reflect হচ্ছে কিনা দেখো
  - N4_13-এ cross-note calculations কাজ করছে কিনা দেখো
  - Ensure all tests pass, ask the user if questions arise.
