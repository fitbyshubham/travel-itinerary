export interface PostUpload {
  type: "image" | "video";
  signed_url: string;
  expires_in: string;
}

export interface PostItinerary {
  id: string;
  title: string;
}

export interface Post {
  id: string;
  user_id: string;
  itinerary_id?: string;
  title: string;
  description: string;
  uploads: PostUpload[];
  visibility: "public" | "private" | "draft";
  soft_deleted: boolean;
  created_at: string;
  updated_at: string;
  itineraries?: PostItinerary;
}
