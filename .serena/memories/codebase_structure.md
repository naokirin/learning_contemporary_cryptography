# コードベース構造の詳細

## ディレクトリ別の役割

### `/src` - TypeScript実装
- **`index.ts`**: メインエントリポイント、全関数のre-export
- **`symmetric/`**: 対称鍵暗号の実装
  - `aes_gcm.ts` - AES-GCM暗号化・復号化
- **`asymmetric/`**: 公開鍵暗号の実装  
  - `rsa_oaep.ts` - RSA-OAEP暗号化・復号化
  - `ecdh.ts` - 楕円曲線ディフィー・ヘルマン鍵交換
  - `id_based_encryption.ts` - ID ベース暗号
- **`hash/`**: ハッシュ関数の実装
  - `sha256.ts` - SHA-256ハッシュ（hex/base64出力）
- **`mac/`**: メッセージ認証コードの実装
  - `hmac_sha256.ts` - HMAC-SHA256
- **`signature/`**: 署名の実装
  - `ed25519.ts` - Ed25519署名

### `/docs` - 理論・解説文書
- **`_template.md`**: 新しい暗号手法文書のテンプレート
- **`001_infosec/`**: 情報セキュリティ基礎
- **`002_crypto_basics/`**: 暗号学基礎  
- **`003_symmetric/`**: 対称鍵暗号理論
- **`004_asymmetric/`**: 公開鍵暗号理論
- **`005_dlp/`**: 離散対数問題ベース暗号
- **`hash/`**: ハッシュ関数理論
- **`mac/`**: MAC理論
- **`signature/`**: デジタル署名理論

### `/articles` - 記事・学習ノート
学習過程で作成される記事やノートが格納される

## 実装例のパターン

### 関数命名パターン
- ハッシュ: `{algorithm}{OutputFormat}` (例: `sha256Hex`, `sha256Base64`)
- 暗号化: `{operation}With{Algorithm}` (例: `encryptWithAes256Gcm`)

### 入出力パターン
```typescript
// 入力: string | Uint8Array の柔軟性
// 出力: 具体的な型での明確性
function cryptoFunction(
  input: string | Uint8Array,
  key?: Uint8Array,
  options?: {...}
): ConcreteReturnType
```

### エラーハンドリングパターン
- Node.js crypto APIの例外をそのまま伝播
- 入力検証は最小限（型システムに依存）
- 暗号学的に不適切な使用は関数レベルでの防止なし（教育用途）