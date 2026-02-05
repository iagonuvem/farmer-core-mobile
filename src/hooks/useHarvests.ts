/**
 * Hook for managing harvests
 */

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { harvestRepository, CreateHarvestInput } from '@/data/repositories/harvestRepository';
import { cropRepository } from '@/data/repositories';
import type { Crop, Cultivar, HarvestEvent } from '@/domain/contracts/types';
import { db } from '@/data/db/schema';

export interface HarvestWithDetails extends HarvestEvent {
  crop?: Crop;
  cultivar?: Cultivar;
}

export function useHarvests() {
  // Get recent harvests
  const recentHarvests = useLiveQuery(
    () => harvestRepository.getRecent(10),
    [],
    []
  );

  // Get recent crops for quick selection
  const recentCrops = useLiveQuery(
    () => cropRepository.getRecent(6),
    [],
    []
  );

  // Get favorite crops
  const favoriteCrops = useLiveQuery(
    () => cropRepository.getFavorites(),
    [],
    []
  );

  // Get all crops for search
  const allCrops = useLiveQuery(
    () => cropRepository.getAll(),
    [],
    []
  );

  const createHarvest = useCallback(async (input: CreateHarvestInput) => {
    return harvestRepository.create(input);
  }, []);

  const getHarvestWithDetails = useCallback(async (harvestId: string): Promise<HarvestWithDetails | null> => {
    const harvest = await harvestRepository.getById(harvestId);
    if (!harvest) return null;

    const crop = await cropRepository.getById(harvest.cropId);
    let cultivar: Cultivar | undefined;
    if (harvest.cultivarId) {
      cultivar = await db.cultivars.get(harvest.cultivarId);
    }

    return { ...harvest, crop, cultivar };
  }, []);

  const searchCrops = useCallback(async (query: string) => {
    if (!query.trim()) return allCrops;
    return cropRepository.search(query);
  }, [allCrops]);

  const getCultivarsForCrop = useCallback(async (cropId: string): Promise<Cultivar[]> => {
    return db.cultivars.where('cropId').equals(cropId).toArray();
  }, []);

  return {
    recentHarvests: recentHarvests ?? [],
    recentCrops: recentCrops ?? [],
    favoriteCrops: favoriteCrops ?? [],
    allCrops: allCrops ?? [],
    createHarvest,
    getHarvestWithDetails,
    searchCrops,
    getCultivarsForCrop,
  };
}
