# コードスタイルと規約

## TypeScript設定
- **ターゲット**: ES2022
- **モジュール**: ES2022 (ESM)
- **strict モード**: 有効
- **追加の厳格チェック**:
  - `noUncheckedIndexedAccess`
  - `noImplicitOverride`  
  - `noPropertyAccessFromIndexSignature`
  - `exactOptionalPropertyTypes`

## Biome設定（リント・フォーマット）
- **インデント**: スペース2個
- **行幅**: 100文字
- **推奨ルール**: 有効
- **Git統合**: 有効（.gitignoreファイルを尊重）

## 命名規約
- **関数**: camelCase（例: `sha256Hex`, `encryptWithAes256Gcm`）
- **型**: PascalCase（例: `DigestEncoding`）
- **ファイル**: snake_case（例: `aes_gcm.ts`, `hmac_sha256.ts`）
- **ディレクトリ**: snake_case（例: `symmetric/`, `asymmetric/`）

## 実装パターン
- **入力**: `string | Uint8Array` の型ユニオンを受け入れ
- **出力**: 具体的な型（`string`, `Buffer`, オブジェクト）を返す
- **エクスポート**: 各機能を個別の関数として公開
- **エラーハンドリング**: Node.js crypto APIの例外をそのまま伝播

## ファイル構成
- **メインエントリ**: `src/index.ts` でre-export
- **実装**: カテゴリごとにディレクトリ分割
- **ドキュメント**: `docs/` でMarkdown形式

## コメント・ドキュメント
- **コード内コメント**: 最小限（self-documentingを重視）
- **ドキュメント**: `docs/_template.md` の構造に従う
  - 概要、用語、セキュリティ注意、サンプルコード、参考資料

## 依存関係
- **Node.js標準**: `crypto` モジュールを優先使用
- **サードパーティ**: 最小限（開発ツールのみ）
- **import**: ES6 import/export構文