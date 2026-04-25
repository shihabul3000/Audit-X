# Requirements Document: Audit-X Bug Fixes

## Introduction

Assignment ফোল্ডারের প্রজেক্টে Prototype-এর সাথে তুলনা করে বেশ কিছু functional সমস্যা পাওয়া গেছে। এই spec-এ সেই সমস্যাগুলো fix করার requirements define করা হয়েছে।

## Glossary

- **System**: Assignment/Frontend + Assignment/Backend combined
- **notesData**: N4_13 tab-এর JSON data (sections, ppe, shareConfig, taxConfig, etc.)
- **auditData**: Cover, SFP, PNL, SCE, SCF, PPE tab-এর JSON data
- **useAuditDataAPI**: TanStack Query-based hook যা backend থেকে data fetch করে
- **useGlobalStoreSync**: PPE data থেকে notesData-তে sync করার hook
- **recalculate**: N4_13-এর cross-note calculation engine
- **N4_13_Store**: N4_13 tab-এর local store যা useAuditDataAPI-এর উপর নির্ভর করে

## Requirements

### Requirement 1: notesData Null Initialization Fix

**User Story:** As a student, I want N4_13 tab to work on a newly created financial year, so that I can enter notes data immediately.

#### Acceptance Criteria

1. WHEN a financial year has no notesData in the database, THE System SHALL initialize notesData with default values (buildInitialSections + default config) on first save
2. WHEN updateNotesData is called and notesData is null, THE System SHALL use default notesData as the base instead of returning early
3. WHEN a financial year is loaded with null notesData, THE N4_13_Store SHALL display default empty sections instead of crashing

---

### Requirement 2: auditData Null Initialization Fix

**User Story:** As a student, I want Cover and PPE tabs to work on a newly created financial year, so that I can enter data immediately.

#### Acceptance Criteria

1. WHEN a financial year has no auditData in the database, THE System SHALL initialize auditData with default values on first save
2. WHEN updateData is called and auditData is null, THE System SHALL use default auditData as the base instead of returning early

---

### Requirement 3: PPE → N4_13 Sync Fix

**User Story:** As a student, I want PPE values to automatically appear in N4_13 notes, so that I don't have to enter the same data twice.

#### Acceptance Criteria

1. WHEN PPE asset data changes, THE useGlobalStoreSync SHALL sync costClosing_cy, costOpening_py, depClosing_cy, depOpening_py, totalDepCharged_cy, adminDep_cy to notesData.ppe
2. WHEN useGlobalStoreSync updates notesData.ppe, THE System SHALL run recalculate() on the draft to propagate values to Note04 and other dependent notes
3. WHEN notesData is null (new year), THE useGlobalStoreSync SHALL still sync by initializing notesData with defaults first

---

### Requirement 4: recalculate() Completeness Fix

**User Story:** As a student, I want all cross-note calculations to update automatically when I change any value, so that the financial statements stay consistent.

#### Acceptance Criteria

1. WHEN any row value is updated in N4_13, THE System SHALL run recalculate() after the update
2. WHEN any table item (bank, shareholder, loan, upas) is added, updated, or deleted, THE System SHALL run recalculate() after the change
3. WHEN a row is added or deleted, THE System SHALL run recalculate() after the change

---

### Requirement 5: N4_13 Data Load Fix

**User Story:** As a student, I want N4_13 to load my previously saved data when I open a financial year, so that my work is preserved.

#### Acceptance Criteria

1. WHEN a financial year is loaded with existing notesData, THE N4_13_Store SHALL display the saved sections and config values
2. WHEN notesData.sections is missing or empty, THE N4_13_Store SHALL merge with buildInitialSections() to ensure all notes are present
3. WHEN notesData is loaded from API, THE System SHALL run recalculate() once to ensure all derived values are correct
