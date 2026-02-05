/**
 * App Settings Repository
 */

import { db } from '../db/schema';
import type { AppSettings } from '@/domain/contracts/types';
import { DEFAULT_SETTINGS } from '../db/seed';

const SETTINGS_ID = 'app-settings';

export const settingsRepository = {
  /**
   * Get app settings
   */
  async get(): Promise<AppSettings> {
    const settings = await db.appSettings.get(SETTINGS_ID);
    return settings || DEFAULT_SETTINGS;
  },

  /**
   * Update app settings
   */
  async update(data: Partial<Omit<AppSettings, 'id'>>): Promise<AppSettings> {
    const current = await this.get();
    const updated: AppSettings = {
      ...current,
      ...data,
      id: SETTINGS_ID
    };
    
    await db.appSettings.put(updated);
    return updated;
  },

  /**
   * Mark onboarding as completed
   */
  async completeOnboarding(): Promise<void> {
    await this.update({ onboardingCompleted: true });
  },

  /**
   * Update farm info
   */
  async updateFarmInfo(farmName: string, contactInfo: string): Promise<void> {
    await this.update({ farmName, contactInfo });
  },

  /**
   * Set locale
   */
  async setLocale(locale: string): Promise<void> {
    await this.update({ locale });
  },

  /**
   * Set theme
   */
  async setTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
    await this.update({ theme });
  }
};
