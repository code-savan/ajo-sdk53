import AsyncStorage from '@react-native-async-storage/async-storage'

const PROFILE_CACHE_KEY = 'profile_cache_v1'

export async function getCachedProfile<T = any>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(PROFILE_CACHE_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as T } catch { return null }
}

export async function setCachedProfile(value: any): Promise<void> {
  await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(value))
}

export async function clearCachedProfile(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_CACHE_KEY)
}

// Simple utility functions for React Native
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
