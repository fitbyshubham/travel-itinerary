import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/lib/store";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filename?: string;
}

interface UploadMediaResponse {
  url?: string;
  signed_url?: string;
  filename?: string;
  message?: string;
}

const POST_MEDIA_ENDPOINT =
  "https://xzqyctdsftsvkvvhdwvl.supabase.co/functions/v1/upload-post-media";
const AVATAR_ENDPOINT =
  "https://xzqyctdsftsvkvvhdwvl.supabase.co/functions/v1/upload-avatar";
const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const DEFAULT_ALLOWED_TYPES = ["image/", "video/"];

/**
 * Uploads a media file (Post/Package) and returns a signed URL
 */
export async function uploadMediaFile(file: File): Promise<UploadResult> {
  try {
    // 1. Pre-upload Validation
    if (file.size > DEFAULT_MAX_FILE_SIZE) {
      return { success: false, error: "FILE_TOO_LARGE" };
    }

    const isAllowed = DEFAULT_ALLOWED_TYPES.some((type) =>
      file.type.startsWith(type),
    );
    if (!isAllowed) {
      return { success: false, error: "INVALID_FILE_TYPE" };
    }

    // 2. Get Auth Token
    let token: string | null | undefined = null;

    try {
      token = useAuthStore.getState().token;
    } catch (e) {
      // Fallback if store isn't initialized
    }

    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("auth_token");
    }

    if (!token) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    // 3. Form Data Preparation
    const formData = new FormData();
    const fileExtension = file.name.split(".").pop();
    const newFilename = `${uuidv4()}.${fileExtension}`;
    formData.append("file", file, newFilename);

    // 4. Edge Function Call
    const response = await fetch(POST_MEDIA_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
      } catch {
        // ignore JSON parse error
      }
      return { success: false, error: errorMessage };
    }

    // 5. Response Parsing
    const result: UploadMediaResponse = await response.json();

    return {
      success: true,
      url: result.url || result.signed_url,
      filename: result.filename,
    };
  } catch (error: unknown) {
    console.error("Media upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "NETWORK_ERROR";
    return { success: false, error: errorMessage };
  }
}

/**
 * Uploads an avatar image
 */
export async function uploadAvatar(file: File): Promise<UploadResult> {
  try {
    // Validation: 5MB limit for avatars, Images only
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "FILE_TOO_LARGE_5MB_LIMIT" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "INVALID_FILE_TYPE_IMAGE_ONLY" };
    }

    // Auth
    let token = useAuthStore.getState().token;
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("auth_token");
    }

    if (!token) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    const formData = new FormData();
    const fileExtension = file.name.split(".").pop();
    const newFilename = `avatar_${uuidv4()}.${fileExtension}`;
    formData.append("file", file, newFilename);

    const response = await fetch(AVATAR_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
      } catch {
        // ignore
      }
      return { success: false, error: errorMessage };
    }

    const result = await response.json();

    // Check for various potential key names for the URL
    const uploadedUrl = result.url || result.signed_url || result.avatar_url;

    if (!uploadedUrl) {
      console.error("Upload successful but no URL found in response:", result);
      return { success: false, error: "MISSING_URL_IN_RESPONSE" };
    }

    return {
      success: true,
      url: uploadedUrl,
    };
  } catch (error: unknown) {
    console.error("Avatar upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "NETWORK_ERROR";
    return { success: false, error: errorMessage };
  }
}
