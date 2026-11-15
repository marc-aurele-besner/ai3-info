import type { ApiData } from "./api";

export const SAMPLE_DATA: ApiData = {
  blockHeight: 4321987,
  spacePledged: "2.40 PB",
  blockchainSize: "18.60 TB",
  spacePledgedBytes: "2400000000000000",
  blockchainSizeBytes: "18600000000000",
};

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "Unavailable";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
  const index = Math.max(
    0,
    Math.min(Math.floor(Math.log10(bytes) / 3), units.length - 1),
  );
  return `${(bytes / 1000 ** index).toLocaleString("en-US", { maximumFractionDigits: 2 })} ${units[index]}`;
}

// Older cached responses have formatted decimal units but no raw byte fields.
export function storageBytes(
  raw: string | undefined,
  formatted: string,
): number | null {
  if (raw && /^\d+$/.test(raw) && Number.isFinite(Number(raw)))
    return Number(raw);
  const match = formatted.match(/^([\d.]+)\s*(B|Bytes|KB|MB|GB|TB|PB|EB)$/i);
  if (!match) return null;
  const unit = match[2].toUpperCase();
  const index =
    unit === "BYTES"
      ? 0
      : ["B", "KB", "MB", "GB", "TB", "PB", "EB"].indexOf(unit);
  const value = Number(match[1]) * 1000 ** index;
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function contributionShare(
  terabytes: number,
  networkBytes: number,
): number {
  const added = terabytes * 1e12;
  return (added / (networkBytes + added)) * 100;
}

/** Formats a percentage with three significant figures, e.g. "0.00421%". */
export function formatShare(percent: number): string {
  return `${percent.toLocaleString("en-US", { maximumSignificantDigits: 3 })}%`;
}

/**
 * Expresses a percentage share as "1 in N", e.g. "1 in 240" or "1 in 2.4M".
 * Returns null when the share is too large for the phrase to make sense.
 */
export function formatOneIn(percent: number): string | null {
  if (!Number.isFinite(percent) || percent <= 0) return null;
  const n = 100 / percent;
  if (n < 2) return null;
  const rounded = Number(n.toPrecision(n < 1000 ? 3 : 2));
  return `1 in ${rounded.toLocaleString(
    "en-US",
    rounded < 1e6
      ? { maximumFractionDigits: 0 }
      : { notation: "compact", maximumSignificantDigits: 2 },
  )}`;
}

/** Bounds of the logarithmic storage contribution slider. */
export const CAPACITY_MIN_TB = 1;
export const CAPACITY_MAX_TB = 1024;
export const CAPACITY_STEPS = 1000;

const capacityLogRange = Math.log(CAPACITY_MAX_TB / CAPACITY_MIN_TB);

// Whole TB below 100, then steps of 5 and 10 so large values land on round numbers.
function roundCapacity(terabytes: number): number {
  const step = terabytes < 100 ? 1 : terabytes < 500 ? 5 : 10;
  return Math.round(terabytes / step) * step;
}

/** Maps a slider position (0–CAPACITY_STEPS) to TB on a log scale. */
export function capacityFromPosition(position: number): number {
  if (position <= 0) return CAPACITY_MIN_TB;
  if (position >= CAPACITY_STEPS) return CAPACITY_MAX_TB;
  const raw =
    CAPACITY_MIN_TB * Math.exp((position / CAPACITY_STEPS) * capacityLogRange);
  return Math.min(
    CAPACITY_MAX_TB,
    Math.max(CAPACITY_MIN_TB, roundCapacity(raw)),
  );
}

/** Inverse of capacityFromPosition, rounded to the nearest slider position. */
export function positionFromCapacity(terabytes: number): number {
  const clamped = Math.min(
    CAPACITY_MAX_TB,
    Math.max(CAPACITY_MIN_TB, terabytes),
  );
  return Math.round(
    (Math.log(clamped / CAPACITY_MIN_TB) / capacityLogRange) * CAPACITY_STEPS,
  );
}
