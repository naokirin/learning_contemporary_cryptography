# 対称鍵暗号（Symmetric Cryptography）

## 概要
同一の秘密鍵を用いて暗号化と復号を行う方式。高速かつ大容量データの処理に向く。

## 代表的なアルゴリズム
- AES-GCM（推奨）
- ChaCha20-Poly1305

## サンプルコード
- AES-GCM 実装例: `src/symmetric/aes_gcm.ts`

## セキュリティ上の注意
- 鍵長は 256bit（32バイト）を推奨
- GCM の IV は原則 12 バイト・重複禁止
- AAD を活用してヘッダ等の完全性も保護

## 参考資料
- NIST SP 800-38D: Galois/Counter Mode (GCM)
- IETF: ChaCha20-Poly1305 