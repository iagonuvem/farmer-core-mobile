# Lovable Plan — Farmer Core (Offline-First Agroforest Log)

**North star:** build structure that serves life — freedom through rhythm, responsibility through clarity.
**MVP scope:** Farmer Core only (no Bridge features).
**Core outcome:** a local-first app that turns harvest + inventory truth into a WhatsApp-ready availability message and a contract-validated Availability Pack export.

---

## 1) Vision

A simple, offline-first mobile app (Ionic + Capacitor + PWA) that empowers agroforest workers to:

* register crops/cultivars,
* log harvests fast via a wizard flow,
* manage inventory manually with expiration awareness,
* **generate a WhatsApp-ready availability message (primary outcome)**,
* export a portable Availability Pack (JSON + CSV ZIP) validated against typed data contracts.

**Non-negotiables**

* Works 100% offline after install.
* No account required.
* Farmer owns data and can leave anytime with full history via exports.
* Strong typing end-to-end + clear docs.

---

## 2) Product Principles

* **Freedom through rhythm:** the weekly ritual is the product flow.
* **Responsibility through clarity:** deterministic outputs, typed contracts, versioned schemas.
* **Local-first sovereignty:** device is source of truth; sharing is explicit via export.
* **Cooperation ecosystem:** exports enable others to build Bridges, but Farmer Core includes no marketplace, bots, rankings, or surveillance.

---

## 3) MVP Modules

1. Crop/Culture Registry (categories, crops, cultivars, shelf-life defaults)
2. Harvest Logging (wizard; creates Lots + estimated expiration)
3. Inventory Management (lots + manual adjustments + expiration alerts)
4. **Availability Message Generator (primary) + Copy-to-Clipboard**
5. Export & Backup (Availability Pack: JSON + CSV ZIP, contract-validated)
6. Offline-first Architecture (IndexedDB + service worker + Capacitor sharing)

---

## 4) Navigation (Minimal Bottom Bar + One FAB + One Copy Button)

**Bottom bar has exactly 3 items:**

* **Left:** Home
* **Center:** BIG **Add FAB** (“+”) — opens actions
* **Right:** **Copy to Clipboard** — copies the *current availability message* instantly

### Center Add FAB (action sheet)

1. **Log Harvest (Wizard)** (default)
2. Adjust Inventory
3. Add Crop / Cultivar
4. Configure Availability (windows, header, ordering text) (optional but useful)
5. (Optional) Add Zone / Site

### Right button behavior (Copy to Clipboard)

* Single tap copies the **latest generated** availability message.
* If no availability exists yet:

  * tap opens “Generate Availability” screen (or shows a prompt: “Generate your first list”).
* After copy:

  * toast/snackbar confirmation: “Copied ✅”
  * optional: show last-copied timestamp on Home.

**Home header:** small Settings icon (not in bottom nav).

---

## 5) Availability is the Primary Outcome (UI flow)

### Default ritual on Home

Home strongly guides the core outcome:

* A prominent card: **“Current Availability”**

  * status: up-to-date / stale
  * last generated time
  * quick “Regenerate” button
* A preview snippet (first ~5 lines) of the message
* Expiring-soon items list that encourages regeneration

### Availability “truth” rule

* The app maintains a **Current Availability List** (latest snapshot):

  * generated from inventory snapshot + availability config
  * editable before saving as current
* The right bottom button copies this “current” message.

---

## 6) Fast Wizard Logging SLO (Definition of Done)

**Goal:** routine harvest entry via wizard in **≤ 30 seconds** once the farmer has a crop catalog.

### Wizard constraints (speed-first)

* **3–4 steps max**, each step designed for one thumb + large targets.
* Each step auto-advances when selection is made (where safe).
* “Back” is always available; “Cancel” confirms discard.
* Defaults reduce typing; recents/favorites reduce searching.

### Wizard steps (MVP)

**Step 1 — Choose Crop**

* Search + **Recent crops chips (last 6)** + Favorites.
* Select crop → auto-advance.

**Step 2 — Quantity + Unit**

* Quantity numeric keypad.
* Unit defaults from `Crop.defaultUnit`.
* Optional quick buttons: `+1`, `+0.5`, `+5` (configurable).
* Continue auto-enabled when quantity valid.

**Step 3 — Context (Optional, ultra-fast)**

* Zone (default: last used)
* Date/time (default now; collapsed)
* Notes (collapsed)
* Save.

**Optional Step 4 — Review (only if needed)**

* Only shown if expiry is missing (no shelf-life default) or unit mismatch.
* Otherwise skip review and save immediately.

### Acceptance metric

* On a seeded demo dataset (10 crops), a new user can complete a harvest log in ≤ 30s after a 1-minute orientation.
* For experts with favorites, target is **≤ 15 seconds**.

---

## 7) Typed Data Contract (Source of Truth)

Implement the **Typed Data Contract Skeleton** as the canonical domain layer:

* TypeScript interfaces + Zod runtime validators
* Schema versioning (SemVer) in `manifest.schemaVersion`
* Export bundle layout (manifest + json/ + csv/) exactly as specified

**Design rule:** domain types are shared by:

* UI (wizard + availability)
* DB repositories
* export writers
* validators

---

## 8) Data Model (Local-First, Snapshot-Friendly)

### Storage approach

* IndexedDB as system of record.
* Append-only-ish events for:

  * `HarvestEvent`
  * `InventoryAdjustment`
* Derived state:

  * `Lot` records (created on harvest)
  * `InventorySnapshot` (materialized view for fast UI)
  * `AvailabilityList` (saved as “current” after generation/edit)

### Key behaviors

* Harvest event creates a Lot with `quantityRemaining`.
* Expiration estimate:

  * cultivar override else crop default shelf-life days.
* Inventory adjustments change lots/crop totals via deltas (reason enum).
* Availability items derived from inventory snapshot, editable before saving as current.

---

## 9) Core Feature Specs (MVP)

### 9.1 Crop/Culture Registry

**Entities:** CropCategory, Crop, Cultivar
**Features:**

* Predefined categories (Fruits, Vegetables, Grains, Herbs, Nuts, Roots) + user-defined.
* Crop fields: name, category, default unit, shelfLifeDaysDefault, optional guild tags, notes.
* Cultivar fields: name, optional shelfLifeDaysOverride, notes.
* Minimal “zone” support: allow zones but keep optional.

**UI:** Cultures reachable via Add FAB.

---

### 9.2 Harvest Logging (Wizard)

**Entities:** HarvestEvent, Lot
**Features:**

* Wizard flow per Section 6.
* Auto expiration estimate stored on lot.
* Recent harvests list on Home.

---

### 9.3 Inventory Management

**Entities:** Lot, InventoryAdjustment, InventorySnapshot
**Features:**

* Inventory view grouped by crop/cultivar.
* Drill-down to lots (FIFO by expiry).
* Manual adjustments: sold/consumed/damage/loss/gift/correction/processing.
* Expiration alerts:

  * Green / Yellow / Red based on days-to-expiry thresholds.

**UI:** Inventory reachable via Add FAB + Home cards.

---

### 9.4 Availability Message Generator (Primary) + Copy Button

**Entities:** AvailabilityList, AvailabilityItem, AvailabilityWindow, WhatsAppTemplate
**Features:**

* Generate availability list from inventory snapshot (default “This week”).
* Allow edits: remove items, adjust quantities, add windows.
* Deterministic WhatsApp template generation (no randomness).
* Save as **Current Availability**.
* Bottom-right button copies the current message instantly.
* If current availability is “stale” (inventory changed since generation), Home shows a warning and suggests regenerate.

**UI:** Home “Current Availability” card is prominent; Copy button is always available.

---

### 9.5 Export & Backup (Availability Pack)

**Entities:** AvailabilityPack, Manifest
**Features:**

* Export ZIP containing:

  * `manifest.json`
  * JSON files per contract
  * CSV files per contract tables
* Validate export with Zod before writing.
* Export via Settings or Home (not bottom bar).
* Share/export via Capacitor Share Sheet and/or Filesystem.
* Export options: pack for current availability list (default) and optional full history.

**UI:** Settings → Export & Backup + optional Home shortcut.

---

## 10) Technical Approach

### Stack

* Ionic React + TypeScript (strict)
* Capacitor (Clipboard, Share, Filesystem)
* IndexedDB (Dexie preferred, or idb)
* Vite + PWA plugin (offline caching)
* Zod for runtime validation
* JSZip for pack bundling; PapaParse for CSV
* i18n: react-i18next (pt-BR default)

### Architecture (modules)

* `domain/` contracts + rules (shelf-life, expiry, availability generator)
* `data/` db schema + repos + snapshot builder
* `export/` writers + validators + zip packer
* `ui/` Ionic pages/components + navigation + wizard + availability editor
* `docs/` README, ARCHITECTURE, USER_GUIDE, DATA_CONTRACTS, EXPORT_SPEC, GLOSSARY

---

## 11) Implementation Phases (Lovable-ready)

### Phase 1 — Foundation (Offline + Contracts + DB)

**Build**

* Ionic + Capacitor project scaffold
* PWA offline caching configured
* Strict TS + lint + formatting
* Implement domain contracts (TS) + Zod validators
* IndexedDB schema + repositories
* Seed data for dev (sample categories/crops)
  **Done when**
* App installs, runs offline, persists a Crop and HarvestEvent locally
* Types compile under strict mode

---

### Phase 2 — Core Flow: Catalog + Harvest Wizard → Lot + Inventory Snapshot

**Build**

* Cultures UI (CRUD categories/crops/cultivars)
* Harvest Wizard UI (recents, favorites, defaults, 3–4 steps)
* Lot creation + expiresAtEstimate computation
* Inventory snapshot builder + Inventory UI (grouped + lot drill-down)
* Inventory adjustments (reasons enum) applied to lots/snapshot
  **Done when**
* User can create crops, log harvest via wizard, see lots in inventory, adjust quantities, see expiry status colors
* Routine wizard logging meets ≤ 30s SLO

---

### Phase 3 — Availability as Primary Outcome + Copy Button

**Build**

* “Current Availability” domain concept:

  * generate from inventory snapshot
  * editable
  * save as current
* Deterministic WhatsApp template generator
* Bottom-right **Copy to Clipboard** button behavior:

  * copies current message
  * if none exists, routes to generate flow
* Home dashboard emphasizes availability:

  * status (up-to-date/stale)
  * last generated time
  * preview + regenerate
    **Done when**
* Farmer can regenerate and copy the availability message in seconds, entirely offline

---

### Phase 4 — Export: Availability Pack (JSON + CSV + ZIP)

**Build**

* Manifest generation (schemaVersion, exportedAt, appVersion, packId)
* JSON writers per contract + top-level pack JSON
* CSV writers matching contract tables
* ZIP builder + share sheet
* Zod validation before export
  **Done when**
* Exported ZIP matches folder layout spec, validates, and opens cleanly on another device/computer

---

### Phase 5 — Polish + Docs + Hardening

**Build**

* Wizard speed refinements (favorites, last-used zone/unit, quick qty buttons)
* Availability UX refinements (stale detection, regen prompts)
* Error handling + recovery guidance
* Documentation complete (see below)
* Minimal tests for rules and determinism
  **Done when**
* Logging SLO achieved consistently
* Availability copying is frictionless and reliable
* Docs explain how exports enable an ecosystem without lock-in

---

## 12) Documentation Deliverables (Required)

* `README.md` — setup, scripts, offline behavior, stack
* `ARCHITECTURE.md` — modules, data flow, event/snapshot approach
* `DATA_CONTRACTS.md` — schema versioning + typed contracts + validation approach
* `EXPORT_SPEC.md` — pack layout + CSV column definitions + example pack
* `GLOSSARY.md` — domain language
* `USER_GUIDE.pt-BR.md` — end-user guide (screens + workflows)
* `CONTRIBUTING.md` — coding standards, strict typing, how to add schema versions

---

## 13) MVP Acceptance Criteria (Shipping checklist)

* Offline: app functions in airplane mode after install.
* Sovereignty: no account required; data stays local; export works.
* Fast wizard logging: routine harvest entry ≤ 30 seconds using recents/defaults.
* Inventory truth: adjustments supported with reasons; lots tracked with expiry estimate.
* Availability primary: “Current Availability” exists, is editable, and is prominently shown on Home.
* Copy button: bottom-right copies the current availability message instantly; routes to generate if missing.
* WhatsApp output: deterministic, copy/paste, readable.
* Export: Availability Pack ZIP includes JSON+CSV; schemaVersion present; validated before export.
* No shadow features: no rankings, no surveillance analytics, no forced network dependency.
