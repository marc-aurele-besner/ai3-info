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
