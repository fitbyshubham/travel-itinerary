export interface FeedUpload {
  url: string;
  type: "image" | "video";
  signed_url?: string;
  expires_in?: string;
}

export interface FeedUser {
  id: string;
  name: string;
  avatar_url?: string;
  country?: string;
  preferred_currency?: string;
  is_creator?: boolean;
}

export interface FeedItem {
  id: string;
  user_id: string;
  itinerary_id?: string;
  title: string;
  description: string;
  uploads: FeedUpload[];
  visibility: string;
  created_at: string;
  liked: boolean;
  like_count: number;
  comment_count: number;
  user: FeedUser;
}

export interface FeedResponse {
  count: number;
  page: number;
  page_size: number;
  next_page: number | null;
  prev_page: number | null;
  results: FeedItem[];
}

export interface Commenter {
  id: string;
  name?: string;
  avatar_url?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  commenter_id: string;
  comment_text: string;
  status: string;
  created_at: string;
  updated_at: string;
  commenter?: Commenter;
}

export interface FetchCommentsResponse {
  comments: Comment[];
}

export interface AddCommentResponse {
  success: boolean;
  comment: Comment;
}
