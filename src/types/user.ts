export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_creator?: boolean;
  created_at?: string;
}
