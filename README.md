# learning_crypto

暗号技術の学習内容を、暗号技術の種類ごとに整理し、Markdown の説明と TypeScript のサンプルコードで管理するリポジトリです。

## ディレクトリ構成
- `docs/`: 各手法の概要・理論・参考資料などの Markdown
  - `docs/_template.md`: 記述テンプレート
  - `docs/symmetric/`: 対称鍵暗号（AES-GCM など）
  - `docs/asymmetric/`: 公開鍵暗号（RSA/ECC など）
  - `docs/hash/`: ハッシュ関数（SHA-256 など）
  - `docs/mac/`: メッセージ認証コード（HMAC など）
  - `docs/signature/`: 署名（RSA-PSS / Ed25519 など）
- `src/`: TypeScript での最小サンプル実装
  - `src/symmetric/aes_gcm.ts`
  - `src/asymmetric/rsa_oaep.ts`
  - `src/hash/sha256.ts`
  - `src/mac/hmac_sha256.ts`
  - `src/signature/ed25519.ts`

## セットアップと利用
- 開発（ウォッチ）: `npm run dev`
- ビルド: `npm run build`
- 実行: `node dist/index.js`
- 型チェック: `npm run typecheck`
- Lint: `npm run lint`
- フォーマット: `npm run format`
- 自動修正: `npm run fix`

それぞれの手法については `docs/<category>/README.md` を読み、`src/<category>/*.ts` の実装・使い方を確認してください。 