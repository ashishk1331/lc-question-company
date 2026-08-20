'use client';

import { useEffect } from 'react';

import { useQuestionsStore } from '@/store/useQuestionsStore';

/**
 * Reads persisted progress out of localStorage after the first paint, so the
 * server HTML and the initial client render stay identical.
 */
export default function StoreHydration() {
  useEffect(() => {
    useQuestionsStore.persist.rehydrate();
  }, []);

  return null;
}
