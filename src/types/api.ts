export interface AuthResponse {
  user: import("./user").User;
  token: string;
}

export interface ItineraryResponse {
  itinerary: import("./itinerary").Itinerary;
}

export interface ItinerariesResponse {
  itineraries: import("./itinerary").Itinerary[];
}

export interface BookingResponse {
  booking: import("./booking").Booking;
}
