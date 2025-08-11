# トリプルDES（Triple DES, 3DES/TDEA）

## 概要

- 64-bit ブロック長の DES を 3 回合成したブロック暗号（TDEA: Triple Data Encryption Algorithm）。
- 方式は主に EDE（Encrypt–Decrypt–Encrypt）。互換性のため真ん中が Decrypt。EEE 変種もあるが標準は EDE。
- 2鍵方式（EDE2）と 3鍵方式（EDE3）がある。
- 鍵は 56-bit × 3（入力は各 64-bit で奇数パリティ 8-bit を含む）。2鍵方式では独立鍵は 2 本（`K3 = K1`）。
- 鍵構成（Keying Options）
  - Option 1（EDE3）: `K1, K2, K3` がすべて独立（名目 168-bit、実効 ≈ 112-bit 近傍：MITM）。
  - Option 2（EDE2）: `K3 = K1`（名目 112-bit、実効 ≈ 112-bit）。
  - Option 3: `K1 = K2 = K3`（単一 DES と同等、禁止）。
- 安全性と運用
  - 64-bit ブロックゆえ誕生日境界は約 \(2^{32}\) ブロック（≈ 32 GiB）で安全域を逸脱しやすい。
  - 現代では新規採用は非推奨。レガシー互換用途に限定し、原則 AES（GCM などの AEAD）を使用。

## 定義とアルゴリズム

### パラメータと部品
- **ブロック長**: 64 bit（左右 32 bit）
- **鍵長**: 56 bit × 3（入力は各 64 bit、パリティ 8 bit を含む。2鍵方式では独立鍵は 2 本）
- **方式**: EDE（Encrypt–Decrypt–Encrypt）。互換性のため採用。
- **下位原語**: DES の `DES_Encrypt`, `DES_Decrypt`, `DES_KeySchedule`（詳細は `docs/003_symmetric/des.md`）

### サブ鍵生成（Key Schedule）
- 入力: 64-bit 鍵 `K1_64, K2_64, K3_64`（Option 2 では `K3_64 = K1_64`）
- 出力: 各 DES の 16 個サブ鍵列（暗号化順用と復号順用）

```text
function TDEA_KeySchedule(K1_64, K2_64, K3_64, keying_option):
  if keying_option == 2:              // EDE2（2 鍵）
    K3_64 <- K1_64
  // 各 DES の 16 個の 48-bit サブ鍵列（暗号化順）
  K1[1..16] <- DES_KeySchedule(K1_64)
  K2[1..16] <- DES_KeySchedule(K2_64)
  K3[1..16] <- DES_KeySchedule(K3_64)
  // 復号ではサブ鍵を逆順に適用（Feistel の性質）
  K1_rev[1..16] <- reverse(K1)
  K2_rev[1..16] <- reverse(K2)
  K3_rev[1..16] <- reverse(K3)
  return (K1, K2, K3, K1_rev, K2_rev, K3_rev)
```

### データ暗号化（Encrypt）

- EDE3（Option 1）の定義（Option 2 は `K3 = K1` として同様）

```text
function TDEA_Encrypt_EDE3(M, K1, K2, K3):         // 入力: 平文 64-bit
  B1 <- DES_Encrypt(M, K1)                         // 第1段: E_{K1}
  B2 <- DES_Decrypt(B1, K2)                        // 第2段: D_{K2}
  C  <- DES_Encrypt(B2, K3)                        // 第3段: E_{K3}
  return C                                         // 出力: 暗号文 64-bit
```

- EDE2（Option 2）の定義（`K3 = K1`）

```text
function TDEA_Encrypt_EDE2(M, K1, K2):             // K3 は K1 に同一
  return TDEA_Encrypt_EDE3(M, K1, K2, K1)
```

### データ復号化（Decrypt）

- EDE3（Option 1）の定義（Option 2 は `K3 = K1` として同様）

```text
function TDEA_Decrypt_EDE3(C, K1, K2, K3):         // 入力: 暗号文 64-bit
  B1 <- DES_Decrypt(C, K3)                         // 第1段: D_{K3}
  B2 <- DES_Encrypt(B1, K2)                        // 第2段: E_{K2}
  M  <- DES_Decrypt(B2, K1)                        // 第3段: D_{K1}
  return M                                         // 出力: 平文 64-bit
```

- EDE2（Option 2）の定義（`K3 = K1`）

```text
function TDEA_Decrypt_EDE2(C, K1, K2):             // K3 は K1 に同一
  return TDEA_Decrypt_EDE3(C, K1, K2, K1)
```

> 注意: ここでの `DES_Encrypt/Decrypt` は `des.md` の定義（16 ラウンド Feistel、IP/FP を含む 1 ブロック手続き）を指す。

## 実務上の位置づけ

- 新規システムでは非推奨。64-bit ブロック長の制約（誕生日境界 ≈ 2^{32} ブロック）と性能面の不利がある。
- レガシー互換（既存プロトコル/ハードウェア）に限り使用。順次 AES（GCM 等）へ移行する。

## 関連ドキュメント
- DES の詳細: `docs/003_symmetric/des.md`
- ブロック暗号の概論: `docs/003_symmetric/block_ciphers.md`

## 参考資料
- NIST SP 800-67 Rev.2: Recommendation for the Triple Data Encryption Algorithm (TDEA)
- NIST SP 800-131A Rev.2: Transitioning the Use of Cryptographic Algorithms and Key Lengths
- ANSI X9.52: Triple Data Encryption Algorithm Modes of Operation
- FIPS PUB 46-3: Data Encryption Standard (DES)


