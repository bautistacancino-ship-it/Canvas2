'use client';

import { LoadingBlob } from '@/components/ui/Blob';
import { useGameStore, useHasHydrated } from '@/store/useGameStore';
import { BusinessPicker } from './BusinessPicker';
import { LevelMap } from './LevelMap';

export function HomeScreen() {
  const hydrated = useHasHydrated();
  const hasProfile = useGameStore((s) => Boolean(s.profile));

  if (!hydrated) return <LoadingBlob />;
  return hasProfile ? <LevelMap /> : <BusinessPicker />;
}
