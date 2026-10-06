// Public IDs: users VPU, bills VPB, autopay VPA, providers VPP,
// transactions VPT, tickets VTK, agents VAG. Existing IDs are never rewritten.
export type PublicIdPrefix = "VPU" | "VPB" | "VPA" | "VPP" | "VPT" | "VTK" | "VAG";

export function generatePublicId(prefix: PublicIdPrefix): string {
  if (!/^[A-Z]{3}$/.test(prefix)) {
    throw new Error("Public ID prefixes must be three uppercase letters.");
  }
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `${prefix}-${hex}`;
}
