import crypto from "node:crypto";

export function hmacSha256Hex(key: string | Uint8Array, data: string | Uint8Array): string {
  return crypto
    .createHmac("sha256", typeof key === "string" ? key : Buffer.from(key))
    .update(typeof data === "string" ? data : Buffer.from(data))
    .digest("hex");
}

export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
