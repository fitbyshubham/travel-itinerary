import { useAuthStore } from "@/lib/store";
import type { Itinerary } from "@/types/itinerary";
import type { Booking } from "@/types/booking";
import type { LoginResponse } from "@/types/auth";
import type {
  FeedResponse,
  AddCommentResponse,
  FetchCommentsResponse,
} from "@/types/feed";
import type { Package } from "@/types/package";
import type { Post } from "@/types/post";

const API_BASE_URL = "https://xzqyctdsftsvkvvhdwvl.supabase.co/functions/v1";

export interface UserProfile {
  id: string;
  name: string;
  gender: string;
  avatar_url: string;
  is_creator: boolean;
  bio: string | null;
  preferred_currency: string;
  country: string;
  created_at: string;
  updated_at: string;
  soft_deleted: boolean;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  if (typeof window === "undefined") return {};

  // 1. Try to get token from Zustand Store first (Memory)
  let token = useAuthStore.getState().token;

  // 2. Fallback to localStorage if store isn't hydrated yet (Safety net)
  if (!token) {
    token = localStorage.getItem("auth_token");
  }

  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
}

export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint.replace(/^\/+/, "")}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeader = await getAuthHeader();
    const userHeaders =
      options.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : options.headers && typeof options.headers === "object"
          ? (options.headers as Record<string, string>)
          : {};

    const headers: Record<string, string> = {
      ...baseHeaders,
      ...authHeader,
      ...userHeaders,
    };

    const config: RequestInit = {
      ...options,
      headers,
      signal: controller.signal,
    };

    const res = await fetch(url, config);
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));

      // Global 401 Interceptor
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          useAuthStore.getState().logout();
          if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/signup"
          ) {
            window.location.href = "/login";
          }
        }
        throw new Error("SESSION_EXPIRED");
      }

      const errorMessage =
        errorData.message || errorData.error || `HTTP ${res.status}`;
      throw new Error(errorMessage);
    }

    return res.json() as Promise<T>;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error("REQUEST_TIMEOUT // CONNECTION_STALLED");
    }
    throw err;
  }
}

export const authApi = {
  login: ({ email, password }: { email: string; password: string }) =>
    api<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signup: (data: Record<string, unknown>) =>
    api<LoginResponse>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getProfile: () => api<UserProfile>("/profile", { method: "GET" }),
  updateProfile: (data: Partial<UserProfile>) =>
    api<UserProfile>("/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const itineraryApi = {
  list: () =>
    api<Itinerary[] | { itineraries: Itinerary[] }>("/get-itineraries", {
      method: "GET",
    }),
  listPurchased: () =>
    api<{ itineraries: Array<{ itinerary: Itinerary }> } | Itinerary[]>("/purchased-itineraries", {
      method: "GET",
    }),
  getById: (id: string) => api<Itinerary>(`/get-itinerary?id=${id}`),
  create: (data: Record<string, unknown>) =>
    api<{ itinerary: Itinerary }>("/create-itinerary", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const bookingApi = {
  book: (
    itineraryId: string,
    data: Omit<Booking, "id" | "itinerary_id" | "created_at">,
  ) =>
    api<{ booking: Booking }>("/bookings", {
      method: "POST",
      body: JSON.stringify({ itinerary_id: itineraryId, ...data }),
    }),
};

export const packageApi = {
  list: () =>
    api<Package[] | { packages: Package[] }>("/list-packages", {
      method: "GET",
    }),
  listPurchased: () =>
    api<Package[] | { packages: Package[] }>(`/list-purchased-packages?ts=${Date.now()}`, {
      method: "GET",
    }),
  listByItinerary: (itineraryId: string, userId?: string) =>
    api<Package[] | { packages: Package[] }>(
      `/list-packages?itinerary_id=${itineraryId}${userId ? `&user_id=${userId}` : ""}`,
      {
        method: "GET",
      },
    ),
  create: (data: {
    title: string;
    description: string;
    price: number;
    currency: string;
    visibility: string;
    cover_image_url: string;
    itinerary_id?: string;
  }) =>
    api<{ package: Package }>("/create-package", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  addItineraries: (packageId: string, itineraryIds: string[]) =>
    api<{ message: string; success?: boolean }>("/add-package-itineraries", {
      method: "POST",
      body: JSON.stringify({
        package_id: packageId,
        itinerary_ids: itineraryIds,
      }),
    }),
  subscribe: (packageId: string) =>
    api<{ message: string; success?: boolean }>("/subscribe-package", {
      method: "POST",
      body: JSON.stringify({ package_id: packageId }),
    }),
  createCheckout: (packageId: string) =>
    api<{ checkout_url: string }>("/create-package-checkout", {
      method: "POST",
      body: JSON.stringify({
        package_id: packageId,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/profile?tab=packages`,
      }),
    }),
};

export const postApi = {
  list: () =>
    api<Post[]>("/get-posts", {
      method: "GET",
    }),
  getById: (id: string, userId?: string) =>
    api<{ post: Post }>(
      `/get-posts?id=${id}${userId ? `&user_id=${userId}` : ""}`,
      {
        method: "GET",
      },
    ),
  create: (data: {
    title: string;
    description: string;
    itinerary_id?: string;
    visibility: "public" | "draft";
    uploads: Array<{ type: "image" | "video"; url: string }>;
  }) =>
    api<{ post: Post }>("/create-post", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const feedApi = {
  getTailoredFeed: (page: number = 1, pageSize: number = 10) =>
    api<FeedResponse>(
      `/fetch-tailored-feed?page_size=${pageSize}&page=${page}`,
    ),

  // New Discover Feed Endpoint (Video Only)
  discoverFeed: (page: number = 1, pageSize: number = 10) =>
    api<FeedResponse>(
      `/discover-feed?page_size=${pageSize}&page=${page}&video_only=true`,
      {
        method: "GET",
      },
    ),

  searchFeed: (query: string, page: number = 1, pageSize: number = 10) =>
    api<FeedResponse>(
      `/search-feed?q=${encodeURIComponent(query)}&page_size=${pageSize}&page=${page}`,
      {
        method: "GET",
      },
    ),
  toggleLike: (postId: string) =>
    api<{ post_id: string; user_id: string; liked: boolean }>("/toggle-like", {
      method: "POST",
      body: JSON.stringify({ post_id: postId }),
    }),
  addComment: (postId: string, text: string) =>
    api<AddCommentResponse>("/add-comment", {
      method: "POST",
      body: JSON.stringify({ post_id: postId, comment_text: text }),
    }),
  fetchComments: (postId: string) =>
    api<FetchCommentsResponse>(`/fetch-comments?post_id=${postId}`, {
      method: "GET",
    }),
};
