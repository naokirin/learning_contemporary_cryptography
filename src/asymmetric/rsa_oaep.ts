import {
  constants,
  generateKeyPairSync,
  type KeyObject,
  privateDecrypt,
  publicEncrypt,
} from "node:crypto";

export function generateRsaKeyPair(modulusLength = 2048): {
  publicKey: KeyObject;
  privateKey: KeyObject;
} {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength,
    publicExponent: 0x10001,
  });
  return { publicKey, privateKey };
}

export function rsaOaepEncrypt(
  publicKey: KeyObject,
  message: string | Uint8Array,
  hash: "sha256" | "sha512" = "sha256",
): Buffer {
  return publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: hash,
    },
    typeof message === "string" ? Buffer.from(message) : Buffer.from(message),
  );
}

export function rsaOaepDecrypt(
  privateKey: KeyObject,
  ciphertext: Uint8Array,
  hash: "sha256" | "sha512" = "sha256",
): Buffer {
  return privateDecrypt(
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: hash,
    },
    Buffer.from(ciphertext),
  );
}
