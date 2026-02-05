/**
 * Lot Repository
 */

import { db } from '../db/schema';
import type { Lot, HarvestEvent, Crop, Cultivar } from '@/domain/contracts/types';
import { calculateExpirationDate } from '@/domain/rules/expiration';

export const lotRepository = {
  /**
   * Get all lots with remaining quantity
   */
  async getActive(): Promise<Lot[]> {
    return db.lots
      .where('quantityRemaining')
      .above(0)
      .toArray();
  },

  /**
   * Get lots by crop
   */
  async getByCrop(cropId: string): Promise<Lot[]> {
    return db.lots
      .where('cropId')
      .equals(cropId)
      .filter(lot => lot.quantityRemaining > 0)
      .toArray();
  },

  /**
   * Get lot by ID
   */
  async getById(id: string): Promise<Lot | undefined> {
    return db.lots.get(id);
  },

  /**
   * Get lots expiring soon (within N days)
   */
  async getExpiringSoon(days: number = 3): Promise<Lot[]> {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + days);
    
    return db.lots
      .where('quantityRemaining')
      .above(0)
      .filter(lot => new Date(lot.expiresAtEstimate) <= threshold)
      .toArray();
  },

  /**
   * Create a lot from harvest event
   */
  async createFromHarvest(
    harvestEvent: HarvestEvent,
    crop: Crop,
    cultivar?: Cultivar
  ): Promise<Lot> {
    const now = new Date().toISOString();
    const harvestedAt = new Date(harvestEvent.harvestedAt);
    const expiresAt = calculateExpirationDate(harvestedAt, crop, cultivar);
    
    const lot: Lot = {
      id: harvestEvent.lotId,
      cropId: harvestEvent.cropId,
      cultivarId: harvestEvent.cultivarId,
      zoneId: harvestEvent.zoneId,
      harvestEventId: harvestEvent.id,
      initialQuantity: harvestEvent.quantity,
      quantityRemaining: harvestEvent.quantity,
      unit: harvestEvent.unit,
      harvestedAt: harvestEvent.harvestedAt,
      expiresAtEstimate: expiresAt.toISOString(),
      notes: harvestEvent.notes,
      createdAt: now,
      updatedAt: now
    };
    
    await db.lots.add(lot);
    return lot;
  },

  /**
   * Adjust lot quantity
   */
  async adjustQuantity(id: string, delta: number): Promise<Lot | undefined> {
    const lot = await db.lots.get(id);
    if (!lot) return undefined;
    
    const newQuantity = Math.max(0, lot.quantityRemaining + delta);
    
    await db.lots.update(id, {
      quantityRemaining: newQuantity,
      updatedAt: new Date().toISOString()
    });
    
    return { ...lot, quantityRemaining: newQuantity };
  },

  /**
   * Get all lots sorted by expiration (FIFO)
   */
  async getAllSortedByExpiry(): Promise<Lot[]> {
    return db.lots
      .where('quantityRemaining')
      .above(0)
      .sortBy('expiresAtEstimate');
  }
};
