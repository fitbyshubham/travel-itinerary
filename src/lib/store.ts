// src/lib/store.ts
import { create } from "zustand";
import { User } from "@/types/auth";
import {
  ItineraryStep,
  ItineraryStay as Stay,
  ItineraryFood as Food,
  ItineraryActivity as Activity,
} from "@/types/itinerary";

export interface TripForm {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  visibility: "public" | "private";
  steps: ItineraryStep[];
}
import { v4 as uuidv4 } from "uuid";

// ─── AUTH STATE ───────────────────────────────────────────────

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  hydrateFromStorage: () => void;
}

// ─── TRIP FORM STATE ───────────────────────────────────────────

const createEmptyStep = (): ItineraryStep => ({
  id: uuidv4(),
  order_index: 0,
  start_location: "",
  end_location: "",
  mode_of_transport: "train",
  start_time: "",
  end_time: "",
  duration_mins: 0,
  notes: "",
  food: [],
  activities: [],
  stays: [],
  step_costs: [],
  itinerary_id: "",
  created_at: new Date().toISOString(),
});

const createEmptyTrip = (): TripForm => ({
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  total_cost: 0,
  visibility: "public",
  steps: [createEmptyStep()],
});

interface TripFormState extends TripForm {
  // Actions
  updateField: <K extends keyof TripForm>(field: K, value: TripForm[K]) => void;
  addStep: () => void;
  removeStep: (stepId: string) => void;
  updateStep: (stepId: string, updates: Partial<ItineraryStep>) => void;
  addStay: (stepId: string, stay: Omit<Stay, "id">) => void;
  addFood: (stepId: string, food: Omit<Food, "id">) => void;
  addActivity: (stepId: string, activity: Omit<Activity, "id">) => void;
  removeStay: (stepId: string, stayId: string) => void;
  removeFood: (stepId: string, foodId: string) => void;
  removeActivity: (stepId: string, activityId: string) => void;
  recalculateTotalCost: () => void;
  reset: () => void;
}

// ─── COMBINED STORE ───────────────────────────────────────────

interface CombinedState extends AuthState, TripFormState {
  isHydrated: boolean; // ✅ Added
}

export const useAuthStore = create<CombinedState>((set, get) => {
  // ── AUTH ACTIONS ────────────────────────────────────────────
  const authActions = {
    login: (token: string, user: User) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
      set({ token, user });
    },

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
      set({ token: null, user: null, isHydrated: true }); // ✅ mark as hydrated after logout
    },

    hydrateFromStorage: () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        const userStr = localStorage.getItem("user");
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr) as User;
            set({ token, user, isHydrated: true }); // ✅ success: mark hydrated
            return;
          } catch (e) {
            console.warn("Failed to parse auth data");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
          }
        }
        // If no token or parse failed, still mark as hydrated
        set({ isHydrated: true });
      } else {
        // Server-side: mark as hydrated immediately
        set({ isHydrated: true });
      }
    },
  };

  // ── TRIP FORM ACTIONS ───────────────────────────────────────
  const tripActions: Omit<TripFormState, keyof TripForm> = {
    updateField: (field, value) =>
      set({ [field]: value } as Partial<CombinedState>),

    addStep: () => {
      const steps = get().steps;
      const newStep = createEmptyStep();
      newStep.order_index = steps.length + 1;
      set({ steps: [...steps, newStep] });
    },

    removeStep: (stepId) => {
      const steps = get().steps.filter((s) => s.id !== stepId);
      set({ steps });
      get().recalculateTotalCost();
    },

    updateStep: (stepId, updates) => {
      set({
        steps: get().steps.map((step) =>
          step.id === stepId
            ? {
                ...step,
                ...updates,
                // Auto-calculate duration if times changed
                duration_mins:
                  updates.start_time || updates.end_time
                    ? Math.max(
                        0,
                        (new Date(updates.end_time || step.end_time).getTime() -
                          new Date(
                            updates.start_time || step.start_time
                          ).getTime()) /
                          (1000 * 60)
                      )
                    : step.duration_mins,
              }
            : step
        ),
      });
      get().recalculateTotalCost();
    },

    addStay: (stepId, stayData) => {
      const stay = { ...stayData, id: uuidv4() };
      set({
        steps: get().steps.map((step) =>
          step.id === stepId ? { ...step, stays: [...step.stays, stay] } : step
        ),
      });
      get().recalculateTotalCost();
    },

    addFood: (stepId, foodData) => {
      const food = { ...foodData, id: uuidv4() };
      set({
        steps: get().steps.map((step) =>
          step.id === stepId ? { ...step, food: [...step.food, food] } : step
        ),
      });
      get().recalculateTotalCost();
    },

    addActivity: (stepId, activityData) => {
      const activity = { ...activityData, id: uuidv4() };
      set({
        steps: get().steps.map((step) =>
          step.id === stepId
            ? { ...step, activities: [...step.activities, activity] }
            : step
        ),
      });
      get().recalculateTotalCost();
    },

    removeStay: (stepId, stayId) => {
      set({
        steps: get().steps.map((step) =>
          step.id === stepId
            ? { ...step, stays: step.stays.filter((s) => s.id !== stayId) }
            : step
        ),
      });
      get().recalculateTotalCost();
    },

    removeFood: (stepId, foodId) => {
      set({
        steps: get().steps.map((step) =>
          step.id === stepId
            ? { ...step, food: step.food.filter((f) => f.id !== foodId) }
            : step
        ),
      });
      get().recalculateTotalCost();
    },

    removeActivity: (stepId, activityId) => {
      set({
        steps: get().steps.map((step) =>
          step.id === stepId
            ? {
                ...step,
                activities: step.activities.filter((a) => a.id !== activityId),
              }
            : step
        ),
      });
      get().recalculateTotalCost();
    },

    recalculateTotalCost: () => {
      const total = get().steps.reduce((sum: number, step) => {
        const stepTotal =
          (step.step_costs || []).reduce((acc: number, cost: any) => acc + (cost.amount || 0), 0) +
          (step.stays || []).reduce((acc: number, stay: any) => acc + (stay.cost || 0), 0) +
          (step.food || []).reduce((acc: number, food: any) => acc + (food.cost || 0), 0) +
          (step.activities || []).reduce((acc: number, activity: any) => acc + (activity.cost || 0), 0);
        return sum + stepTotal;
      }, 0);
      set({ total_cost: parseFloat(total.toFixed(2)) });
    },

    reset: () => {
      const emptyTrip = createEmptyTrip();
      set({
        ...emptyTrip,
      });
    },
  };

  // ── INITIAL STATE ───────────────────────────────────────────
  return {
    // Auth initial state
    token: null,
    user: null,
    isHydrated: false, // ✅ Initialize isHydrated = false

    // Trip form initial state
    ...createEmptyTrip(),

    // Actions
    ...authActions,
    ...tripActions,
  };
});
