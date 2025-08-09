import crypto from "node:crypto";

/**
 * AES-256-GCM で暗号化します。
 * - key: 32 バイト（256bit）
 * - iv: 12 バイト（未指定時はランダム生成）
 * - aad: 省略可（完全性のみ保護）
 */
export function encryptWithAes256Gcm(
  plaintext: Uint8Array | string,
  key: Uint8Array,
  options?: { iv?: Uint8Array; aad?: Uint8Array },
): { iv: Buffer; ciphertext: Buffer; authTag: Buffer } {
  const iv = options?.iv ? Buffer.from(options.iv) : crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key), iv);
  if (options?.aad) cipher.setAAD(Buffer.from(options.aad));

  const ciphertext = Buffer.concat([
    cipher.update(typeof plaintext === "string" ? Buffer.from(plaintext) : Buffer.from(plaintext)),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return { iv, ciphertext, authTag };
}

export function decryptWithAes256Gcm(
  ciphertext: Uint8Array,
  key: Uint8Array,
  iv: Uint8Array,
  options?: { aad?: Uint8Array; authTag?: Uint8Array },
): Buffer {
  const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key), Buffer.from(iv));
  if (options?.aad) decipher.setAAD(Buffer.from(options.aad));
  if (options?.authTag) decipher.setAuthTag(Buffer.from(options.authTag));

  const plaintext = Buffer.concat([decipher.update(Buffer.from(ciphertext)), decipher.final()]);
  return plaintext;
}
