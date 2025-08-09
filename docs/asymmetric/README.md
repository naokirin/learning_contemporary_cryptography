# 公開鍵暗号（Public-Key / Asymmetric Cryptography）

## 概要
公開鍵で暗号化し、対応する秘密鍵で復号する方式。鍵配送や署名検証に使われる。

## 代表的なアルゴリズム
- RSA（RSA-OAEP で暗号化、RSA-PSS で署名）
- 楕円曲線暗号（ECDH/ECDSA、Ed25519/Curve25519）

## サンプルコード
- RSA-OAEP 実装例: `src/asymmetric/rsa_oaep.ts`

## セキュリティ上の注意
- RSA は 2048bit 以上を推奨
- OAEP（SHA-256 以上）を使用
- 直接大きなデータを暗号化せず、ハイブリッド暗号（対称鍵 + 非対称）を推奨

## 参考資料
- PKCS #1 v2.2
- RFC 8017 