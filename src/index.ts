export function main(): void {
  // リポジトリ初期動作確認用
  console.log("learning_crypto: Hello TypeScript + Biome!");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
