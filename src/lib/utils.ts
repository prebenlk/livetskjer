import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts various YouTube URL formats to embed URLs.
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/shorts/
 * Returns the original URL if it's not a recognized YouTube format.
 */
export function toYouTubeEmbedUrl(url: string): string {
  if (!url) return url;
  
  // Already an embed URL
  if (url.includes("youtube.com/embed/")) return url;

  let videoId: string | null = null;

  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) videoId = watchMatch[1];

  // youtu.be/VIDEO_ID
  if (!videoId) {
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) videoId = shortMatch[1];
  }

  // youtube.com/shorts/VIDEO_ID
  if (!videoId) {
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) videoId = shortsMatch[1];
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
}
