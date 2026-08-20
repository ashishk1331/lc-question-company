import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuestionsStore {
  ids: string[];
  /**
   * False until localStorage has been read on the client. Components must render
   * the empty-state markup while this is false, otherwise the first client render
   * disagrees with the prerendered HTML and React throws a hydration mismatch.
   */
  hydrated: boolean;
  setHydrated(value: boolean): void;
  toggleId(id: string): void;
  reset(): void;
}

export const useQuestionsStore = create<QuestionsStore>()(
  persist(
    (set) => ({
      ids: [],
      hydrated: false,
      setHydrated(value) {
        return set({ hydrated: value });
      },
      toggleId(id) {
        return set((prev) => {
          if (prev.ids.includes(id)) {
            return { ids: prev.ids.filter((i) => i !== id) };
          }
          return { ids: [...prev.ids, id] };
        });
      },
      reset() {
        return set({ ids: [] });
      },
    }),
    {
      name: 'lc-questions-company-store',
      // Rehydrate from an effect instead of at module load; see <StoreHydration />.
      skipHydration: true,
      partialize({ ids }) {
        return { ids };
      },
      onRehydrateStorage() {
        return (state) => state?.setHydrated(true);
      },
    },
  ),
);
