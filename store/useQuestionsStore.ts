import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuestionsStore {
  ids: string[];
  toggleId(id: string): void;
}

export const useQuestionsStore = create<QuestionsStore>()(
  persist(
    (set) => ({
      ids: [],
      toggleId(id) {
        return set((prev) => {
          if (prev.ids.includes(id)) {
            return { ids: prev.ids.filter((i) => i !== id) };
          }
          return { ids: [...prev.ids, id] };
        });
      },
    }),
    {
      name: 'lc-questions-company-store',
      partialize({ ids }) {
        return { ids };
      },
    },
  ),
);
