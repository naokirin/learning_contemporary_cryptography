import { generateKeyPairSync, type KeyObject, sign, verify } from "node:crypto";

export function generateEd25519KeyPair(): { publicKey: KeyObject; privateKey: KeyObject } {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  return { publicKey, privateKey };
}

export function signEd25519(privateKey: KeyObject, message: string | Uint8Array): Buffer {
  return sign(
    null,
    typeof message === "string" ? Buffer.from(message) : Buffer.from(message),
    privateKey,
  );
}

export function verifyEd25519(
  publicKey: KeyObject,
  message: string | Uint8Array,
  signature: Uint8Array,
): boolean {
  return verify(
    null,
    typeof message === "string" ? Buffer.from(message) : Buffer.from(message),
    publicKey,
    Buffer.from(signature),
  );
}
