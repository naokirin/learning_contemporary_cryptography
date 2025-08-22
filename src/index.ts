// 暗号実装のエクスポート
export * from './symmetric/aes_gcm';
export * from './asymmetric/rsa_oaep';
export * from './asymmetric/ecdh';
export * from './hash/sha256';
export * from './mac/hmac_sha256';
export * from './signature/ed25519';

export function main(): void {
  // リポジトリ初期動作確認用
  console.log("learning_crypto: Hello TypeScript + Biome!");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
