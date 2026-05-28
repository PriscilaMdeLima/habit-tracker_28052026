import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types/Habit';
import { fetchHabits, toggleHabit as apiToggleHabit, deleteHabit as apiDeleteHabit, createHabit as apiCreateHabit } from '../utils/handle-api';

type FilterType = 'all' | 'completed' | 'pending';

interface HabitStore {
  habits: Habit[];
  loading: boolean;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  loadHabits: () => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  createHabit: (data: Omit<Habit, 'id' | 'completedToday' | 'streak' | 'createdAt'>) => Promise<void>;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      loading: true,
      filter: 'all',
      
      setFilter: (filter) => set({ filter }),
      
      loadHabits: async () => {
        set({ loading: true });
        try {
          const data = await fetchHabits();
          set({ habits: data, loading: false });
        } catch (error) {
          console.error('Failed to load habits:', error);
          set({ loading: false });
        }
      },
      
      toggleHabit: async (id) => {
        try {
          const updated = await apiToggleHabit(id);
          set((state) => ({
            habits: state.habits.map((h) => 
              h.id === id ? { ...h, completedToday: updated.completedToday } : h
            )
          }));
        } catch (error) {
          console.error('Failed to toggle habit:', error);
        }
      },
      
      deleteHabit: async (id) => {
        try {
          await apiDeleteHabit(id);
          set((state) => ({
            habits: state.habits.filter((h) => h.id !== id)
          }));
        } catch (error) {
          console.error('Failed to delete habit:', error);
        }
      },
      
      createHabit: async (data) => {
        try {
          const created = await apiCreateHabit(data);
          set((state) => ({
            habits: [...state.habits, created]
          }));
        } catch (error) {
          console.error('Failed to create habit:', error);
        }
      }
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
