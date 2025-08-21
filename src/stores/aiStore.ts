import { create } from 'zustand';
import { AiQuestion } from '@/types/aiQuestion';

interface AiState {
  questions: AiQuestion[];
  isLoading: boolean;
  error: string | null;
}

interface AiActions {
  setQuestions: (questions: AiQuestion[]) => void;
  addQuestion: (question: AiQuestion) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type AiStore = AiState & AiActions;

export const useAiStore = create<AiStore>((set, get) => ({
  // State
  questions: [],
  isLoading: false,
  error: null,

  // Actions
  setQuestions: (questions: AiQuestion[]) => {
    set({ questions, error: null });
  },

  addQuestion: (question: AiQuestion) => {
    set((state) => ({
      questions: [question, ...state.questions],
      error: null,
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));