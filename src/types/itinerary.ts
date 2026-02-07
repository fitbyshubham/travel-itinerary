export type TransportMode =
  | "flight"
  | "train"
  | "bus"
  | "car"
  | "taxi"
  | "walk"
  | "boat"
  | "other";
export type Visibility = "public" | "private";

export interface ItineraryItemBase {
  id: string;
  name: string;
  cost: number;
  currency: string;
  notes?: string | null;
}

export interface ItineraryFood extends ItineraryItemBase {
  location?: string;
  step_id?: string;
}

export interface ItineraryActivity extends ItineraryItemBase {
  description?: string;
  duration_mins?: number;
  step_id?: string;
}

export interface ItineraryStay extends ItineraryItemBase {
  location?: string;
  check_in?: string;
  check_out?: string;
  step_id?: string;
}

export interface ItineraryStep {
  id: string;
  order_index: number;
  start_location: string;
  end_location: string;
  mode_of_transport: TransportMode;
  start_time: string;
  end_time: string;
  duration_mins: number;
  notes: string;
  geo_location?: any;
  food: ItineraryFood[];
  activities: ItineraryActivity[];
  stays: ItineraryStay[];
  step_costs: any[];
  itinerary_id: string;
  created_at: string;
}

export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
  soft_deleted: boolean;
  itinerary_steps: ItineraryStep[];
}
