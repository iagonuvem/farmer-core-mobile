/**
 * Export Service
 * Generates ZIP files with JSON and CSV exports
 */

import JSZip from 'jszip';
import Papa from 'papaparse';
import { db } from '@/data/db/schema';
import { inventoryRepository } from '@/data/repositories/inventoryRepository';
import { availabilityRepository } from '@/data/repositories/availabilityRepository';
import type { 
  AvailabilityPack, 
  ExportManifest,
  Crop,
  Cultivar,
  CropCategory,
  HarvestEvent,
  Lot,
  InventoryAdjustment
} from '@/domain/contracts/types';
import { APP_VERSION, SCHEMA_VERSION } from '@/domain/contracts';

export interface ExportResult {
  blob: Blob;
  filename: string;
  stats: {
    crops: number;
    cultivars: number;
    categories: number;
    harvests: number;
    lots: number;
    adjustments: number;
  };
}

/**
 * Generate a unique pack ID
 */
function generatePackId(): string {
  return crypto.randomUUID();
}

/**
 * Convert data to CSV string
 */
function toCSV<T extends Record<string, unknown>>(data: T[]): string {
  if (data.length === 0) return '';
  return Papa.unparse(data, {
    header: true,
    quotes: true
  });
}

/**
 * Flatten nested objects for CSV export
 */
function flattenForCSV<T extends object>(items: T[]): Record<string, unknown>[] {
  return items.map(item => {
    const flat: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item)) {
      if (Array.isArray(value)) {
        flat[key] = JSON.stringify(value);
      } else if (typeof value === 'object' && value !== null) {
        flat[key] = JSON.stringify(value);
      } else {
        flat[key] = value;
      }
    }
    return flat;
  });
}

/**
 * Export availability pack (current snapshot + catalog)
 */
export async function exportAvailabilityPack(farmName?: string): Promise<ExportResult> {
  const zip = new JSZip();
  
  // Fetch all data
  const [categories, crops, cultivars, inventorySnapshot] = await Promise.all([
    db.categories.toArray(),
    db.crops.toArray(),
    db.cultivars.toArray(),
    inventoryRepository.generateSnapshot()
  ]);

  // Get latest availability list or create empty one
  let availabilityList = await availabilityRepository.getCurrent();
  if (!availabilityList) {
    availabilityList = {
      id: generatePackId(),
      items: [],
      isStale: true,
      inventorySnapshotAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Create manifest
  const manifest: ExportManifest = {
    schemaVersion: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    packId: generatePackId(),
    packType: 'availability',
    farmName
  };

  // Create availability pack
  const pack: AvailabilityPack = {
    manifest,
    availabilityList,
    inventorySnapshot,
    crops,
    cultivars,
    categories
  };

  // Add JSON files
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  zip.file('availability-pack.json', JSON.stringify(pack, null, 2));

  // Add CSV files
  if (categories.length > 0) {
    zip.file('csv/categories.csv', toCSV(flattenForCSV(categories)));
  }
  if (crops.length > 0) {
    zip.file('csv/crops.csv', toCSV(flattenForCSV(crops)));
  }
  if (cultivars.length > 0) {
    zip.file('csv/cultivars.csv', toCSV(flattenForCSV(cultivars)));
  }
  if (inventorySnapshot.items.length > 0) {
    zip.file('csv/inventory.csv', toCSV(flattenForCSV(inventorySnapshot.items)));
  }
  if (availabilityList.items.length > 0) {
    zip.file('csv/availability.csv', toCSV(flattenForCSV(availabilityList.items)));
  }

  // Generate ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  const date = new Date().toISOString().split('T')[0];
  const filename = `farmer-core-availability-${date}.zip`;

  return {
    blob,
    filename,
    stats: {
      crops: crops.length,
      cultivars: cultivars.length,
      categories: categories.length,
      harvests: 0,
      lots: inventorySnapshot.items.reduce((sum, item) => sum + item.lots.length, 0),
      adjustments: 0
    }
  };
}

/**
 * Export full history (all data including harvests and adjustments)
 */
export async function exportFullHistory(farmName?: string): Promise<ExportResult> {
  const zip = new JSZip();

  // Fetch all data
  const [categories, crops, cultivars, zones, harvests, lots, adjustments, inventorySnapshot] = await Promise.all([
    db.categories.toArray(),
    db.crops.toArray(),
    db.cultivars.toArray(),
    db.zones.toArray(),
    db.harvestEvents.toArray(),
    db.lots.toArray(),
    db.inventoryAdjustments.toArray(),
    inventoryRepository.generateSnapshot()
  ]);

  // Get latest availability list
  let availabilityList = await availabilityRepository.getCurrent();
  if (!availabilityList) {
    availabilityList = {
      id: generatePackId(),
      items: [],
      isStale: true,
      inventorySnapshotAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Create manifest
  const manifest: ExportManifest = {
    schemaVersion: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    packId: generatePackId(),
    packType: 'full_history',
    farmName
  };

  // Add JSON files
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  zip.file('data/categories.json', JSON.stringify(categories, null, 2));
  zip.file('data/crops.json', JSON.stringify(crops, null, 2));
  zip.file('data/cultivars.json', JSON.stringify(cultivars, null, 2));
  zip.file('data/zones.json', JSON.stringify(zones, null, 2));
  zip.file('data/harvests.json', JSON.stringify(harvests, null, 2));
  zip.file('data/lots.json', JSON.stringify(lots, null, 2));
  zip.file('data/adjustments.json', JSON.stringify(adjustments, null, 2));
  zip.file('data/inventory-snapshot.json', JSON.stringify(inventorySnapshot, null, 2));
  zip.file('data/availability-list.json', JSON.stringify(availabilityList, null, 2));

  // Add CSV files
  if (categories.length > 0) {
    zip.file('csv/categories.csv', toCSV(flattenForCSV(categories)));
  }
  if (crops.length > 0) {
    zip.file('csv/crops.csv', toCSV(flattenForCSV(crops)));
  }
  if (cultivars.length > 0) {
    zip.file('csv/cultivars.csv', toCSV(flattenForCSV(cultivars)));
  }
  if (zones.length > 0) {
    zip.file('csv/zones.csv', toCSV(flattenForCSV(zones)));
  }
  if (harvests.length > 0) {
    zip.file('csv/harvests.csv', toCSV(flattenForCSV(harvests)));
  }
  if (lots.length > 0) {
    zip.file('csv/lots.csv', toCSV(flattenForCSV(lots)));
  }
  if (adjustments.length > 0) {
    zip.file('csv/adjustments.csv', toCSV(flattenForCSV(adjustments)));
  }
  if (inventorySnapshot.items.length > 0) {
    zip.file('csv/inventory.csv', toCSV(flattenForCSV(inventorySnapshot.items)));
  }

  // Generate ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  const date = new Date().toISOString().split('T')[0];
  const filename = `farmer-core-full-export-${date}.zip`;

  return {
    blob,
    filename,
    stats: {
      crops: crops.length,
      cultivars: cultivars.length,
      categories: categories.length,
      harvests: harvests.length,
      lots: lots.length,
      adjustments: adjustments.length
    }
  };
}

/**
 * Trigger browser download of a blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const exportService = {
  exportAvailabilityPack,
  exportFullHistory,
  downloadBlob
};
