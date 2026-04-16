// Aspect-ratio → pixel-dimensions map for the social platforms postkit targets.
// All values are the native export dimensions used by each platform.

export const FORMATS = {
  "9:16": { width: 1080, height: 1920, label: "Portrait (TikTok, Reels, Stories)" },
  "4:5":  { width: 1080, height: 1350, label: "Portrait (Instagram feed)" },
  "1:1":  { width: 1080, height: 1080, label: "Square (Instagram, X)" },
  "16:9": { width: 1920, height: 1080, label: "Landscape (X, YouTube)" },
  "3:4":  { width: 1080, height: 1440, label: "Portrait (LinkedIn)" },
};

export const DEFAULT_FORMAT = "9:16";

export function resolveFormat(spec) {
  if (!spec) return FORMATS[DEFAULT_FORMAT];
  if (typeof spec === "string") {
    if (FORMATS[spec]) return FORMATS[spec];
    throw new Error(
      `Unknown format "${spec}". Valid: ${Object.keys(FORMATS).join(", ")}`
    );
  }
  if (spec.width && spec.height) return spec;
  throw new Error(`Invalid format spec: ${JSON.stringify(spec)}`);
}
