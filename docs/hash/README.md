# ハッシュ関数（Cryptographic Hash Functions）

## 概要
可変長入力から固定長のダイジェストを計算。改ざん検知や指紋として利用。

## 代表的なアルゴリズム
- SHA-256 / SHA-512（SHA-2 系）
- SHA3-256 / SHA3-512（SHA-3 系）

## サンプルコード
- SHA-256 実装例: `src/hash/sha256.ts`

## セキュリティ上の注意
- 衝突耐性・第二原像計算量
- 生のハッシュでのパスワード保存は不可（PBKDF2, scrypt, Argon2 などを使用）

## 参考資料
- FIPS 180-4 (SHA-2)
- FIPS 202 (SHA-3) 