export interface PackageUpload {
  type: "image" | "video";
  signed_url: string;
  expires_in: string;
}

export interface PackageItinerary {
  id: string;
  title: string;
  description?: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  visibility: "public" | "private";
  soft_deleted: boolean;
  created_at: string;
  updated_at?: string;
  uploads?: PackageUpload[];
  itineraries?: PackageItinerary;
  package_itineraries?: PackageItinerary[];

  // Fields from purchased packages or detailed views
  price?: number;
  currency?: string;
  cover_image_url?: string;
  creator_id?: string;
  purchased_at?: string;
}
