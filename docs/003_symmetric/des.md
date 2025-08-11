# DES（Data Encryption Standard）

## 概要

- 64-bit ブロック長、56-bit 秘密鍵（表層では 64-bit 入力だが 8 ビットはパリティ）。
- Feistel 構造の 16 ラウンド。初期置換（IP）/最終置換（FP）、拡大置換（E）、S-box（8 個）、P 置換、鍵選択（PC-1/PC-2）を用いる。
- 1977 年に標準化（FIPS PUB 46）。鍵長が短く、現代では総当たり攻撃が現実的なため新規採用は非推奨。実務では AES を使用。

## 定義とアルゴリズム

### パラメータと部品
- **ブロック長**: 64 bit（左右 32 bit に分割）
- **鍵長**: 56 bit（入力は 64 bit。PC-1 でパリティ 8 bit を除去）
- **ラウンド数**: 16
- **主要部品**: IP, FP, E（32→48）, S-box（8 個・各 6→4）, P（32→32）, PC-1（64→56）, 左回転（LS）, PC-2（56→48）
- テーブル（PC-1/2, E, S, P, IP/FP）の具体値は FIPS 仕様に従う。

### サブ鍵生成（Key Schedule）
- 入力: 64-bit 鍵 `K64`（各バイトに奇数パリティ）
- 手順:

```text
function DES_KeySchedule(K64):                 // DES のサブ鍵列を生成する
  K56 <- PC1(K64)                              // 64→56（パリティ除去）
  (C0, D0) <- split_28_28(K56)                 // 28 bit + 28 bit に分割
  shifts = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1]   // 各ラウンドの左回転量（LS）
  for i from 1 to 16:                          // 16 ラウンド分の鍵を導出
    Ci <- left_rotate(C(i-1), shifts[i])       // 左半分 C を左回転
    Di <- left_rotate(D(i-1), shifts[i])       // 右半分 D を左回転
    Ki <- PC2(concat(Ci, Di))                  // 56→48 へ圧縮選択（ラウンド鍵）
  return [K1, K2, ..., K16]                    // 16 個の 48-bit サブ鍵を返す
```

- 性質: LS と PC-2 により 48-bit ラウンド鍵 `Ki` が 16 個得られる。

### データ暗号化（Encrypt）
- 入力: 平文ブロック `M ∈ {0,1}^64`、ラウンド鍵列 `[K1..K16]`
- 手順（Feistel 16 ラウンド）:

```text
function DES_Encrypt(M, [K1..K16]):            // 16 個のサブ鍵を用いて 1 ブロックを暗号化
  X <- IP(M)                                   // 初期置換 IP を適用
  (L0, R0) <- split_32_32(X)                   // 左右 32-bit に分割
  for i from 1 to 16:                          // 16 ラウンド繰り返し
    Li <- Ri-1                                 // 左は前ラウンドの右へスワップ
    Ri <- Li-1 XOR F(Ri-1, Ki)                 // 右は前左と F(前右, Ki) の XOR
  Y <- FP(concat(R16, L16))                    // 最終スワップ後に最終置換 FP
  return Y                                     // 暗号文ブロック
```

- ラウンド関数 `F`:

```text
function F(R, K):                              // ラウンド関数（R:32-bit, K:48-bit）
  B <- E(R) XOR K                              // 32→48 に拡大して鍵と XOR
  (b1,...,b8) <- split_into_6bit_blocks(B)     // 6-bit × 8 に分割
  (y1,...,y8) <- (S1(b1),...,S8(b8))           // 各 6→4 S-box で非線形変換（合計 32-bit）
  Y <- P(concat(y1,...,y8))                    // 32-bit に P 置換で拡散
  return Y                                     // 出力
```

### データ復号化（Decrypt）
- 復号は同じ構造でサブ鍵を逆順に適用する（Feistel の利点）。

```text
function DES_Decrypt(C, [K1..K16]):            // 暗号文 1 ブロックを復号
  X <- IP(C)                                   // 初期置換 IP を適用
  (L0, R0) <- split_32_32(X)                   // 左右 32-bit に分割
  for i from 1 to 16:                          // 16 ラウンド繰り返し
    Li <- Ri-1                                 // 左は前ラウンドの右へスワップ
    Ri <- Li-1 XOR F(Ri-1, K(17-i))            // 右は F(前右, 逆順サブ鍵) と前左の XOR
  Y <- FP(concat(R16, L16))                    // 最終スワップ後に最終置換 FP
  return Y                                     // 平文ブロック
```

## 代表的な攻撃と性質

### 相補性（Complementation Property）
- 任意の `M, K` について、`E_K(M) = C` なら `E_{\bar K}(\bar M) = \bar C` が成り立つ（`\bar x` はビット反転）。
- 結果: 鍵探索の実効空間が半減（2 倍の加速）し得る。

### 弱鍵（Weak Keys）
- 4 個の弱鍵が存在し、ラウンド鍵が繰り返し（あるいは全て同一）になるため、`E_K = D_K`（自己逆）等の望ましくない性質を持つ。
- 実装では弱鍵・準弱鍵の使用検出/拒否が推奨。

### 双対鍵（Semi-weak/Dual Keys）
- 6 組 12 鍵が知られ、鍵の組 `K1, K2` について `E_{K1} = D_{K2}` が成り立つ（互いが事実上の逆変換）。
- 多重暗号に対する中間一致（Meet-in-the-middle）と併せ、設計上の注意点となる。

### 差分解読法（Differential Cryptanalysis）
- S-box と拡散の差分遷移確率を利用して鍵情報を回収する攻撃。
- DES 16 ラウンドに対し、典型的に約 `2^47` 組の選択平文ペアが必要（Biham–Shamir）。

### 線形解読法（Linear Cryptanalysis）
- S-box の線形近似を多数集約して鍵ビットのバイアスから推定。
- DES 16 ラウンドに対し、既知平文を約 `2^43` 個要する代表結果が知られる（Matsui）。

> 上記の規模感は代表値であり、前提（選択/既知平文モデル等）に依存して変動する。

## S-DES（Simplified DES）
- 教育目的の縮小版 DES。ブロック長 8 bit、鍵長 10 bit、Feistel 2 ラウンド。
- 実用暗号ではないが、Feistel・S-box・鍵スケジュールの学習に有用。

### S-DES の鍵スケジュール（例）
- 入力: 10-bit 鍵 `K10`
- 典型手順（教科書的定義）:

```text
function SDES_KeySchedule(K10):                // S-DES の 2 つのラウンド鍵を生成
  T <- P10(K10)                                // 10→10 の置換 P10 を適用
  (L, R) <- split_5_5(T)                       // 左右 5-bit に分割
  L1 <- left_rotate(L, 1); R1 <- left_rotate(R, 1)   // 各 1 ビット左回転
  K1 <- P8(concat(L1, R1))                     // 10→8 へ圧縮選択（鍵1）
  L2 <- left_rotate(L1, 2); R2 <- left_rotate(R1, 2) // 追加で 2 ビット左回転
  K2 <- P8(concat(L2, R2))                     // 10→8 へ圧縮選択（鍵2）
  return [K1, K2]                              // 鍵列を返す
```

### S-DES の暗号化/復号（例）

```text
function SDES_Encrypt(M8, [K1, K2]):           // 8-bit ブロックを暗号化
  X <- IP(M8)                                   // 初期置換 IP を適用
  (L0, R0) <- split_4_4(X)                      // 左右 4-bit に分割
  (L1, R1) <- fK(L0, R0, K1)                    // Round 1: fK を鍵 K1 で適用
  (L2, R2) <- (R1, L1)                          // SW（左右入替）
  (L3, R3) <- fK(L2, R2, K2)                    // Round 2: fK を鍵 K2 で適用
  C <- IP^{-1}(concat(L3, R3))                  // 逆初期置換で暗号文
  return C                                      // 暗号文 8-bit

function fK(L, R, K):                           // Feistel の 1 ラウンド更新
  B <- EP(R) XOR K                              // 右半分を EP で 4→8 拡大し鍵と XOR
  (bL, bR) <- split_4_4(B)                      // 左右 4-bit に分割
  sL <- S0(bL); sR <- S1(bR)                    // S0/S1 で各 4→2 の非線形変換
  Y <- P4(concat(sL, sR))                       // 2+2 を結合し P4 で 4-bit に置換
  return (L XOR Y, R)                           // 左を更新（L XOR Y）、右はそのまま

// 復号は [K2, K1] を用いて同様に実施（鍵順を逆にして同じ手順）
```

> 具体的な `P10/P8/IP/EP/P4` と `S0/S1` のテーブルは教材・仕様に依存するため割愛。

## 実務上の位置づけ
- DES は鍵長 56 bit とブロック長 64 bit の限界から、現代の要件を満たさない。新規採用は避け、AES（GCM などの AEAD）を使用する。

## 関連ドキュメント
- ブロック暗号の概論と Feistel/SPN の基礎: `docs/003_symmetric/block_ciphers.md`

## 参考資料
- FIPS PUB 46-3: Data Encryption Standard (DES)
- Eli Biham and Adi Shamir, "Differential Cryptanalysis of DES-like Cryptosystems," Journal of Cryptology, 1991.
- Mitsuru Matsui, "Linear Cryptanalysis Method for DES Cipher," EUROCRYPT 1993.
