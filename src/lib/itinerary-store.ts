import { create } from "zustand";
import type {
  ItineraryDraft,
  ItineraryStep,
  Stay,
  Food,
  Activity,
} from "@/types/builder";

interface ItineraryStore {
  draft: ItineraryDraft;
  updateDraft: (field: keyof ItineraryDraft, value: any) => void;

  // Step Operations
  addStep: () => void;
  removeStep: (id: string) => void;
  updateStep: (id: string, updates: Partial<ItineraryStep>) => void;

  // Sub-item Operations
  addStay: (stepId: string, stay: Omit<Stay, "id">) => void;
  removeStay: (stepId: string, stayId: string) => void;

  addFood: (stepId: string, food: Omit<Food, "id">) => void;
  removeFood: (stepId: string, foodId: string) => void;

  addActivity: (stepId: string, activity: Omit<Activity, "id">) => void;
  removeActivity: (stepId: string, activityId: string) => void;

  calculateTotalCost: () => void;
  reset: () => void;
}

const initialDraft: ItineraryDraft = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  visibility: "public",
  total_cost: 0,
  currency: "EUR",
  estimatedCost: 0,
  steps: [],
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useItineraryStore = create<ItineraryStore>((set, get) => ({
  draft: initialDraft,

  updateDraft: (field, value) =>
    set((state) => ({
      draft: { ...state.draft, [field]: value },
    })),

  addStep: () =>
    set((state) => ({
      draft: {
        ...state.draft,
        steps: [
          ...state.draft.steps,
          {
            id: generateId(),
            order: state.draft.steps.length + 1,
            start_location: "",
            end_location: "",
            mode_of_transport: "flight",
            start_time: "",
            end_time: "",
            stays: [],
            food: [],
            activities: [],
          },
        ],
      },
    })),

  removeStep: (id) => {
    set((state) => ({
      draft: {
        ...state.draft,
        steps: state.draft.steps.filter((s) => s.id !== id),
      },
    }));
    get().calculateTotalCost();
  },

  updateStep: (id, updates) => {
    set((state) => ({
      draft: {
        ...state.draft,
        steps: state.draft.steps.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      },
    }));
    get().calculateTotalCost();
  },

  addStay: (stepId, stay) => {
    set((state) => ({
      draft: {
        ...state.draft,
        steps: state.draft.steps.map((s) => {
          if (s.id !== stepId) return s;
          return { ...s, stays: [...s.stays, { ...stay, id: generateId() }] };
        }),
      },
    }));
    get().calculateTotalCost();
  },

  removeStay: (stepId, stayId) => {
    set((state) => ({
      draft: {
        ...state.draft,
        steps: state.draft.steps.map((s) => {
          if (s.id !== stepId) return s;
          return { ...s, stays: s.stays.filter((i) => i.id !== stayId) };
        }),
      },
    }));
    get().calculateTotalCost();
  },

  addFood: (stepId, food) => {
    set((state) => ({
      draft: {
        ...state.draft,
        steps: state.draft.steps.map((s) => {
          if (s.id !== stepId) return s;
          return { ...s, food: [...s.food, { ...food, id: generateId() }] };
        }),
      },
    }));
    get().calculateTotalCost();
  },

  removeFood: (stepId, foodId) => {
    set((state) => ({
      draft: {
        ...state.draft,
        steps: state.draft.steps.map((s) => {
          if (s.id !== stepId) return s;
          return { ...s, food: s.food.filter((i) => i.id !== foodId) };
        }),
      },
    }));
    get().calculateTotalCost();
  },

  addActivity: (stepId, activity) => {
    set((state) => ({
      draft: {
        ...state.draft,
        steps: state.draft.steps.map((s) => {
          if (s.id !== stepId) return s;
          return {
            ...s,
            activities: [...s.activities, { ...activity, id: generateId() }],
          };
        }),
      },
    }));
    get().calculateTotalCost();
  },

  removeActivity: (stepId, activityId) => {
    set((state) => ({
      draft: {
        ...state.draft,
        steps: state.draft.steps.map((s) => {
          if (s.id !== stepId) return s;
          return {
            ...s,
            activities: s.activities.filter((i) => i.id !== activityId),
          };
        }),
      },
    }));
    get().calculateTotalCost();
  },

  calculateTotalCost: () =>
    set((state) => {
      let total = 0;
      state.draft.steps.forEach((step) => {
        step.stays.forEach((i) => (total += Number(i.price) || 0));
        step.food.forEach((i) => (total += Number(i.price) || 0));
        step.activities.forEach((i) => (total += Number(i.price) || 0));
      });
      return { draft: { ...state.draft, estimatedCost: total } };
    }),

  reset: () => set({ draft: initialDraft }),
}));
