export interface Booking {
  id: string;
  user_id: string;
  itinerary_id: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}
