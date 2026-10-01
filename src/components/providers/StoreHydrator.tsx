'use client';

import { useEffect } from 'react';
import { LEGACY_STORAGE_KEY, STORAGE_KEY, useGameStore } from '@/store/useGameStore';

/**
 * Rehidrata el store desde localStorage solo en el cliente, después del
 * primer render. Así el HTML del servidor y el del cliente coinciden, y
 * los componentes esperan a `hasHydrated` antes de mostrar el progreso.
 */
export function StoreHydrator() {
  useEffect(() => {
    try {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy && !localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // localStorage bloqueado (modo privado, etc.): se parte de cero.
    }
    void useGameStore.persist.rehydrate();
  }, []);
  return null;
}
