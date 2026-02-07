// src/types/auth.ts
export interface UserMetadata {
  name: string;
  avatar_url?: string;
  gender: string;
  country: string;
  preferred_currency: string;
  is_creator: boolean;
  bio: string;
}

export interface User {
  id: string;
  email?: string;
  name: string;
  avatar_url?: string;
  gender?: string;
  country?: string;
  preferred_currency?: string;
  is_creator?: boolean;
  bio?: string;
  created_at: string;
  updated_at?: string;
  user_metadata?: UserMetadata;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
}

export interface LoginResponse {
  message: string;
  session: Session;
  user: User;
}
