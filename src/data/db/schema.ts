/**
 * IndexedDB Schema using Dexie
 * Farmer Core Local Database
 */

import Dexie, { type Table } from 'dexie';
import type {
  CropCategory,
  Crop,
  Cultivar,
  Zone,
  HarvestEvent,
  Lot,
  InventoryAdjustment,
  AvailabilityList,
  AvailabilityConfig,
  AppSettings
} from '@/domain/contracts/types';

export class FarmerCoreDB extends Dexie {
  // Tables
  categories!: Table<CropCategory, string>;
  crops!: Table<Crop, string>;
  cultivars!: Table<Cultivar, string>;
  zones!: Table<Zone, string>;
  harvestEvents!: Table<HarvestEvent, string>;
  lots!: Table<Lot, string>;
  inventoryAdjustments!: Table<InventoryAdjustment, string>;
  availabilityLists!: Table<AvailabilityList, string>;
  availabilityConfig!: Table<AvailabilityConfig, string>;
  appSettings!: Table<AppSettings, string>;

  constructor() {
    super('FarmerCoreDB');

    this.version(1).stores({
      // Primary key is 'id', indexes follow
      categories: 'id, type, sortOrder',
      crops: 'id, categoryId, name, isFavorite, lastUsedAt',
      cultivars: 'id, cropId, name',
      zones: 'id, sortOrder',
      harvestEvents: 'id, cropId, cultivarId, zoneId, harvestedAt, lotId',
      lots: 'id, cropId, cultivarId, harvestEventId, expiresAtEstimate, quantityRemaining',
      inventoryAdjustments: 'id, lotId, cropId, adjustedAt, reason',
      availabilityLists: 'id, createdAt, isStale',
      availabilityConfig: 'id',
      appSettings: 'id'
    });
  }
}

// Singleton instance
export const db = new FarmerCoreDB();
