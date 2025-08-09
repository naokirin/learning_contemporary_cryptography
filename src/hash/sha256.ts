import crypto from "node:crypto";

export type DigestEncoding = "hex" | "base64";

export function sha256Hex(input: string | Uint8Array): string {
  return crypto
    .createHash("sha256")
    .update(typeof input === "string" ? input : Buffer.from(input))
    .digest("hex");
}

export function sha256Base64(input: string | Uint8Array): string {
  return crypto
    .createHash("sha256")
    .update(typeof input === "string" ? input : Buffer.from(input))
    .digest("base64");
}
