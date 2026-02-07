export type Visibility = "public" | "private" | "draft";
export type TransportMode =
  | "flight"
  | "train"
  | "bus"
  | "car"
  | "taxi"
  | "walk"
  | "boat"
  | "other";
export type Gender = "male" | "female" | "other";
export type CostCategory =
  | "transportation"
  | "accommodation"
  | "food"
  | "activities"
  | "miscellaneous";
export type NotificationType = "like" | "comment" | "follow" | "mention";
export type MediaType = "image" | "video";

// --- Core Entities ---

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  gender?: Gender;
  country?: string;
  preferred_currency?: string;
  is_creator: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cost {
  id: string;
  category: CostCategory;
  amount: number;
  currency: string;
  description?: string;
  date: string;
}

// --- Itinerary Blocks ---

export interface Stay {
  id: string;
  name: string;
  location: string;
  check_in_date?: string;
  check_out_date?: string;
  price: number;
  currency: string;
  special_requests?: string;
  notes?: string;
}

export interface Food {
  id: string;
  restaurant_name: string;
  location: string;
  cuisine_type?: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  price: number;
  currency: string;
  rating?: number;
  notes?: string;
  dietary_restrictions?: string[];
}

export interface Activity {
  id: string;
  name: string;
  location: string;
  start_time?: string;
  end_time?: string;
  duration_mins?: number;
  price: number;
  currency: string;
  description?: string;
  notes?: string;
  category?: string;
}

export interface Transportation {
  id: string;
  type: TransportMode;
  from_location: string;
  to_location: string;
  departure_time: string;
  arrival_time: string;
  duration_mins: number;
  price: number;
  currency: string;
  booking_reference?: string;
  notes?: string;
}

// --- Structure ---

export interface ItineraryStep {
  id: string;
  order: number;
  start_location: string;
  end_location: string;
  mode_of_transport: TransportMode;
  duration_mins?: number;
  start_time: string;
  end_time: string;
  notes?: string;
  stays: Stay[];
  food: Food[];
  activities: Activity[];
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  currency: string;
  visibility: Visibility;
  steps: ItineraryStep[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Alias for the store to use
export type ItineraryDraft = Omit<
  Trip,
  "id" | "created_by" | "created_at" | "updated_at"
> & {
  id?: string;
  coverImage?: string;
  estimatedCost: number; // Mapping total_cost to estimatedCost for store compatibility
};

// --- Social & Marketplace ---

export interface Package {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  price: number;
  currency: string;
  visibility: "public" | "private";
  cover_image_url: string;
  itineraries: ItineraryStep[];
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  author_id: string;
  itinerary_id?: string;
  media_urls: Array<{
    type: MediaType;
    url: string;
  }>;
  visibility: "public" | "draft";
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  followed_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}
