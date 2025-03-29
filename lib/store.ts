import { create } from 'zustand';
import { regions } from './bookGenerator';
import { Book } from '@/types';

type ViewMode = 'table' | 'gallery';

interface BookStore {
  // Parameters
  region: string;
  seed: string;
  likes: number;
  reviews: number;
  
  // Books data
  books: Book[];
  loading: boolean;
  error: string | null;
  
  // View options
  viewMode: ViewMode;
  expandedBookId: string | null;
  
  // Actions
  setRegion: (region: string) => void;
  setSeed: (seed: string) => void;
  setLikes: (likes: number) => void;
  setReviews: (reviews: number) => void;
  generateRandomSeed: () => void;
  setBooks: (books: Book[]) => void;
  appendBooks: (books: Book[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setExpandedBookId: (id: string | null) => void;
  clearBooks: () => void;
}

export const useBookStore = create<BookStore>((set) => ({
  // Default values
  region: regions[0],
  seed: Math.floor(Math.random() * 1000000).toString(),
  likes: 5.0,
  reviews: 3.0,
  
  books: [],
  loading: false,
  error: null,
  
  viewMode: 'table',
  expandedBookId: null,
  
  // Actions
  setRegion: (region) => set({ region, books: [] }),
  setSeed: (seed) => set({ seed, books: [] }),
  setLikes: (likes) => set({ likes }),
  setReviews: (reviews) => set({ reviews }),
  
  generateRandomSeed: () => set({ 
    seed: Math.floor(Math.random() * 1000000).toString(),
    books: []
  }),
  
  setBooks: (books) => set({ books }),
  appendBooks: (newBooks) => set((state) => ({ 
    books: [...state.books, ...newBooks] 
  })),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setViewMode: (viewMode) => set({ viewMode }),
  setExpandedBookId: (expandedBookId) => set({ expandedBookId }),
  clearBooks: () => set({ books: [] }),
}));
