/**
 * YouTube utilities
 * Mirrors the helper functions in src/components/media-player.js
 */

/**
 * Extract the 11-character YouTube video ID from any supported URL format.
 * Handles youtube.com/watch?v=, youtu.be/, and embed URLs.
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const match =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i.exec(url);
  return match ? match[1] : null;
}

/**
 * Build a youtube-nocookie.com embed URL for a given video ID.
 * Sets rel=0 to prevent unrelated videos appearing after playback.
 */
export function buildYouTubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({ rel: '0' });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}
