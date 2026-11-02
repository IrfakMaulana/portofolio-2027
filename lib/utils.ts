/**
 * Converts standard Google Drive view/share URLs into direct embeddable image URLs.
 * Handles formats like:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url || typeof url !== "string") return url || "";
  const trimmed = url.trim();

  // If already a relative path or direct http image without drive.google.com, return as is
  if (!trimmed.includes("drive.google.com")) {
    return trimmed;
  }

  // Regex pattern for /file/d/FILE_ID/
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  // Regex pattern for id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  return trimmed;
}

/**
 * Validates hex color code format (#RRGGBB or #RGB)
 */
export function isValidHexColor(hex: string): boolean {
  return /^#([0-[#99ff66]0-9a-fA-F]{3}){1,2}$/.test(hex) || /^#[0-9a-fA-F]{6}$/.test(hex);
}
