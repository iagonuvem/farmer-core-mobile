# Farmer Core: a DaVinci-style agroforest notebook (offline-first)

## One-line

A local-first agroforestry log that turns field observations into a weekly, sellable availability list, while helping farmers learn the ecology of their system over time.

## Why

Agroforestry thrives through cooperation: soil life, plants, fungi, insects, animals, water, light, and human rhythm. Farmers need a tool that records reality, strengthens learning, and produces a simple market output without surrendering ownership.

## MVP scope

This MVP builds **Farmer Core only**:

* Runs fully offline after install
* Requires no account
* Keeps all data with the farmer
* Exports contract-defined data so others can build optional services around it

## The cooperation principle (humans, like ecosystems)

Farmer Core is the **Seed**: open, resilient, farmer-owned.
A healthy ecosystem also creates niches for others to thrive. So Farmer Core is designed to enable a **Bridge ecosystem** that other builders can create (hosting, automation, signature/verification, premium setup/help, marketplace integrations), **without controlling farmers**.

The rule is simple:

* **Farmers own their history**
* **Exports are portable and inspectable**
* **No lock-in is required for value**
  This keeps “cooperation” aligned with nature: you help and also get helped, without domination.

## MVP outcome (the weekly ritual)

Observe → Log harvest → Update inventory → Generate availability → Share on WhatsApp → Export/backup.

## MVP modules

1. Harvest logging

* Record harvest event: crop, quantity, unit, date/time, plot/zone (optional but recommended)
* Estimated expiration date (configurable shelf-life defaults per crop/cultivar)

2. Offline-first PWA

* Works completely offline after install
* Local storage is the source of truth
* No cloud dependency

3. Inventory management (manual, farmer-truthful)

* Current stock by lot (or by crop if simplified)
* Adjustments for loss, damage, self-consumption, gifts, or sales
* Notes for context (why inventory changed)

4. WhatsApp availability template

* Generates a clean copy/paste message:
  items, quantities, units, pickup/delivery windows, ordering instructions (text-only for MVP)
* Designed for fast customer replies and low confusion

5. Export data with datatype contracts

* Contract-validated exports (versioned schemas)
* Export JSON + CSV as a portable “Availability Pack”
* Local backup workflow (download/share file)

6. Register crops (cultures) by category

* Crop catalog: category, cultivar/breed, typical units, shelf-life defaults, notes
* Optional tags for guild/function and seasonality

## The cooperation lens (minimal but powerful)

Each record can optionally include:

* Plot/zone
* Guild/function tags (N-fixer, soil-builder, pollinator support, shade, windbreak)
* Context snapshots (soil moisture, weather notes, phenology stage)
* Signals (pest pressure, disease signs, pollinator activity)

These fields keep the MVP lean while building long-term ecological understanding.

## Principles (freedom through rhythm, responsibility through clarity)

* Local-first sovereignty: your data stays yours
* Contracts over guesswork: typed schemas, versioned formats, clear docs
* Share intentionally: exports are explicit and inspectable
* Enable a service ecosystem: others can build Bridges without capturing farmers
* No rankings: protect dignity and community health

## Non-goals for MVP

* No AI dependency
* No social feeds, public leaderboards, or reputation scores
* No required cloud accounts
* No hidden analytics or behavioral tracking
* No built-in marketplace or messaging automation (those belong to optional Bridges)
