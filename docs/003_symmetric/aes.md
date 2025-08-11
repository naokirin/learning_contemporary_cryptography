# AES（Advanced Encryption Standard）

## 概要

- 128-bit ブロック長をもつ SPN（Substitution–Permutation Network）型のブロック暗号。
- 鍵長は 128/192/256-bit（AES-128/192/256）。ラウンド数はそれぞれ 10/12/14。
- 2001 年に標準化（FIPS 197）。現代の標準的ブロック暗号で、AEAD の AES-GCM などで広く利用される。

## 定義とアルゴリズム

### パラメータと部品

- 記号
  - ブロック長: 128 bit（状態は 4×4 バイト行列 `state`）
  - `Nb = 4`（1 ラウンド当たり 4 語＝16 バイト）
  - `Nk ∈ {4,6,8}`（鍵語数: 128/192/256-bit）
  - `Nr ∈ {10,12,14}`（ラウンド数）
- ラウンドの主要操作（典型的順序）
  - SubBytes: 各バイトに 8×8 S-box を適用（GF(2^8) の逆元＋アフィン変換）。逆変換は InvSubBytes。
  - ShiftRows: 行 `i` を左へ `i` バイト循環シフト（第 0 行は不変）。逆は右シフト（InvShiftRows）。
  - MixColumns: 列ベクトルに固定 4×4 行列を乗算（GF(2^8) 上）。逆は InvMixColumns。
    - 乗算行列（16 進表記）: `[[02,03,01,01],[01,02,03,01],[01,01,02,03],[03,01,01,02]]`
  - AddRoundKey: 状態にラウンド鍵（128 bit）を XOR。

> 注: AES S-box は GF(2^8)（既約多項式 `x^8 + x^4 + x^3 + x + 1`）での `x → x^{-1}`（0 は 0）にアフィン変換を合成したもの。差分一様度が低く、線形近似に強い性質を持つ。

### サブ鍵生成（Key Schedule）

- 入力: 秘密鍵 `K`（`Nk` 語 = 4/6/8 語）
- 出力: ラウンド鍵配列 `RoundKey[0..Nr]`（各 4 語）

```text
function AES_KeySchedule(K, Nk, Nr):                      // K は 4*Nk バイト、語は 32-bit
  Nb <- 4                                                 // 128-bit ブロック
  Nw <- Nb * (Nr + 1)                                     // 生成する語数
  W[0..Nw-1]                                              // 32-bit 語の配列
  // 初期鍵の取り込み
  for i from 0 to Nk-1:
    W[i] <- word_from_bytes(K[4*i .. 4*i+3])
  // 拡張
  for i from Nk to Nw-1:
    temp <- W[i-1]
    if (i mod Nk == 0):
      temp <- SubWord(RotWord(temp)) XOR Rcon[i / Nk]
    else if (Nk > 6 and i mod Nk == 4):
      temp <- SubWord(temp)
    W[i] <- W[i - Nk] XOR temp
  // 4 語ずつでラウンド鍵に分割
  for r from 0 to Nr:
    RoundKey[r] <- (W[4*r], W[4*r+1], W[4*r+2], W[4*r+3])
  return RoundKey

// 補助
function RotWord(w):           // 32-bit を 8-bit 左ローテート（[b0,b1,b2,b3]→[b1,b2,b3,b0]）
function SubWord(w):           // 各バイトに S-box を適用
// Rcon[j] は [2^{j-1}, 0, 0, 0]（GF(2^8) での冪）を表す定数語
```

### データ暗号化（Encrypt）

- 入力: 平文ブロック `M ∈ {0,1}^{128}`、ラウンド鍵 `RoundKey[0..Nr]`
- 出力: 暗号文ブロック `C`

```text
function AES_Encrypt(M, RoundKey[0..Nr]):
  state <- bytes_to_state(M)                // 16 バイト → 4×4 行列
  state <- state XOR RoundKey[0]            // 初回 AddRoundKey（前置ホワイトニング）
  for r from 1 to Nr-1:                     // 中間ラウンド（Nr-1 回）
    state <- SubBytes(state)
    state <- ShiftRows(state)
    state <- MixColumns(state)
    state <- state XOR RoundKey[r]
  // 最終ラウンド（MixColumns なし）
  state <- SubBytes(state)
  state <- ShiftRows(state)
  state <- state XOR RoundKey[Nr]
  return state_to_bytes(state)
```

### データ復号化（Decrypt）

- 入力: 暗号文ブロック `C`、ラウンド鍵 `RoundKey[0..Nr]`

```text
function AES_Decrypt(C, RoundKey[0..Nr]):
  state <- bytes_to_state(C)
  state <- state XOR RoundKey[Nr]           // 後置ホワイトニングから開始
  for r from Nr-1 down to 1:                // 逆順の中間ラウンド
    state <- InvShiftRows(state)
    state <- InvSubBytes(state)
    state <- state XOR RoundKey[r]
    state <- InvMixColumns(state)
  // 最終ラウンド（InvMixColumns なし）
  state <- InvShiftRows(state)
  state <- InvSubBytes(state)
  state <- state XOR RoundKey[0]
  return state_to_bytes(state)
```

## 攻撃に対する耐性

### 差分解読法（Differential Cryptanalysis）

- S-box は差分一様度 4（最大差分遷移確率 4/256）であり、MixColumns（MDS に近い拡散）と ShiftRows によりラウンド間で活性 S-box 数が急増する（ワイドトレイル戦略）。
- 4 ラウンドで最低 25 個の活性 S-box を強制でき、差分トレイル確率は極めて小さい（実用上無視可能）。
- 既知の差分攻撃は減ラウンド版に限られ、フルラウンド AES-128/192/256 に対して総当たりより優れた実用的攻撃は知られていない。

### 線形解読法（Linear Cryptanalysis）

- AES S-box は線形近似の相関が小さく、拡散層の分岐数の大きさと組み合わさって、複数ラウンドに跨る線形近似のバイアスが指数的に抑圧される。
- 減ラウンド AES に対する学術的な結果はあるが、フルラウンドに有効な実用的線形解読は知られていない（必要データ量・計算量が現実的でない）。

> 補足: AES の安全性評価は差分/線形に限らず、不可能差分、積分（Integral）、Boomerang、Differential-Linear、代数的手法、関連鍵等でも広く検討されている。現行標準のパラメータに対し、最良既知攻撃は依然として総当たり探索に近い計算量を要する。

## 実務上の位置づけと注意

- 一般用途では AES-128 を既定、長期・規制準拠や量子計算考慮では AES-256 を選択することが多い。
- 可変長メッセージにはモードが必要。推奨は認証付き暗号（AEAD）の AES-GCM（ノンス一意性は厳守）。
- 実装ではテーブル参照型 S-box に起因するサイドチャネル（キャッシュ等）へ注意し、定数時間実装や AES-NI/ARMv8-AES などのハードウェア命令の利用が推奨。

## 関連ドキュメント/実装

- ブロック暗号の基礎・SPN 構造: `docs/003_symmetric/block_ciphers.md`
- 共通鍵暗号の概要: `docs/003_symmetric/README.md`
- AES-GCM 実装例（AEAD）: `src/symmetric/aes_gcm.ts`

## 参考資料

- FIPS 197: Advanced Encryption Standard (AES)
- NIST SP 800-38A: Recommendation for Block Cipher Modes of Operation
- Joan Daemen, Vincent Rijmen, "The Design of Rijndael"（AES の設計と解析）
- Mihir Bellare, Phillip Rogaway, “On the Security of Block Ciphers” など PRP/SPR の基礎


