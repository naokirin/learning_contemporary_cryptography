## 離散対数問題ベースの暗号（Discrete Logarithm Problem Based Cryptography）

### 概要
離散対数問題（DLP: Discrete Logarithm Problem）の困難性に基づく暗号方式。有限体や楕円曲線上の離散対数を求める問題の計算困難性を利用し、鍵共有、暗号化、電子署名などに応用される。

- **主要用途**: 鍵共有（DH/ECDH）、暗号化（ElGamal）、電子署名（DSA/ECDSA）
- **数学的基盤**: 有限体の乗法群または楕円曲線群上の離散対数問題
- **実用性**: 楕円曲線版（ECC）により鍵長を短縮し、効率性を向上

### 数学的基盤

#### 離散対数問題（DLP）
有限体 \(\mathbb{F}_p\) の乗法群 \(\mathbb{F}_p^*\) において、生成元 \(g\) と \(h = g^x\) が与えられたとき、\(x = \log_g h\) を求める問題。

**形式的定義**:
- 入力: 素数 \(p\)、生成元 \(g \in \mathbb{F}_p^*\)、\(h \in \mathbb{F}_p^*\)
- 出力: \(g^x \equiv h \pmod{p}\) を満たす \(x \in \{0, 1, \ldots, p-2\}\)

**楕円曲線版（ECDLP）**:
楕円曲線 \(E(\mathbb{F}_p)\) 上の点 \(P\) と \(Q = xP\) が与えられたとき、\(x\) を求める問題。

#### 計算複雑性
- **古典計算**: 指数時間 \(O(\sqrt{p})\)（Baby-step Giant-step、Pollard's rho）
- **量子計算**: 多項式時間 \(O(\log^3 p)\)（Shor's algorithm）
- **現在の推奨**: 楕円曲線では256ビット、有限体では2048ビット以上

### Diffie-Hellman鍵共有（DH Key Exchange）

#### 基本プロトコル
1. **パラメータ設定**: 素数 \(p\) と生成元 \(g \in \mathbb{F}_p^*\) を公開
2. **鍵生成**:
   - Alice: 秘密鍵 \(a \in_R \{1, \ldots, p-2\}\)、公開値 \(A = g^a \bmod p\)
   - Bob: 秘密鍵 \(b \in_R \{1, \ldots, p-2\}\)、公開値 \(B = g^b \bmod p\)
3. **鍵共有**: 両者が \(K = g^{ab} = A^b = B^a \bmod p\) を計算

#### 楕円曲線版（ECDH）
楕円曲線 \(E(\mathbb{F}_p)\) 上の点 \(P\) を使用:
- Alice: 秘密鍵 \(a\)、公開値 \(A = aP\)
- Bob: 秘密鍵 \(b\)、公開値 \(B = bP\)
- 共有鍵: \(K = abP = aB = bA\)

#### 安全性
- **CDH仮定**: \(g^a, g^b\) から \(g^{ab}\) を計算することは困難
- **DDH仮定**: \(g^a, g^b, g^c\) と \(g^a, g^b, g^{ab}\) を識別することは困難
- **実装上の注意**: 静的DH鍵の再利用は危険（Perfect Forward Secrecyのため）

### Diffie-Hellman問題（DH Problems）

#### 計算的Diffie-Hellman問題（CDH）
**定義**: \(g^a, g^b\) が与えられたとき、\(g^{ab}\) を計算する問題

**形式的定義**:
- 入力: \((g, g^a, g^b)\) where \(a, b \in_R \{1, \ldots, p-2\}\)
- 出力: \(g^{ab}\)

**困難性**: DLPが困難ならばCDHも困難（逆は未解決）

#### 判定的Diffie-Hellman問題（DDH）
**定義**: 与えられた3つ組 \((g^a, g^b, g^c)\) が \(c = ab\) を満たすかどうかを判定する問題

**形式的定義**:
- 入力: \((g, g^a, g^b, g^c)\) where \(a, b \in_R \{1, \ldots, p-2\}\)
- 出力: \(c = ab\) かどうかの判定

**困難性**: CDHより強い仮定（CDHが困難でもDDHが容易な群が存在）

#### 問題間の関係
```
DLP ≤ CDH ≤ DDH
```
- DLP ≤ CDH: DLPを解ければCDHも解ける
- CDH ≤ DDH: CDHを解ければDDHも解ける
- 逆方向は一般に成り立たない

### ElGamal暗号

#### 鍵生成
- 秘密鍵: \(x \in_R \{1, \ldots, p-2\}\)
- 公開鍵: \(y = g^x \bmod p\)

#### 暗号化
平文 \(m \in \mathbb{F}_p^*\) に対して:
- 乱数 \(k \in_R \{1, \ldots, p-2\}\) を選択
- 暗号文: \((c_1, c_2) = (g^k, m \cdot y^k) = (g^k, m \cdot g^{xk})\)

#### 復号化
- 平文: \(m = c_2 \cdot (c_1^x)^{-1} = c_2 \cdot (g^{kx})^{-1}\)

#### 安全性
- **IND-CPA安全**: DDH仮定の下で証明可能
- **非改ざん性**: 単独では保証されない（ハイブリッド暗号で対応）

### 楕円曲線暗号（ECC）

#### 利点
- **鍵長短縮**: 256ビットの楕円曲線は3072ビットRSAと同等の安全性
- **計算効率**: 点のスカラー倍算は高速
- **メモリ効率**: 短い鍵長によりメモリ使用量削減

#### 代表的な曲線
- **NIST P-256**: 256ビット、広く採用
- **Curve25519**: 255ビット、高速実装、Edwards曲線
- **secp256k1**: 256ビット、Bitcoinで使用

#### 実装上の注意
- **点の圧縮**: 楕円曲線上の点は圧縮形式で保存可能
- **スカラー倍算**: 高速化アルゴリズム（double-and-add、NAF等）
- **サイドチャネル攻撃**: 定数時間実装が重要

### 攻撃手法

#### 古典的攻撃
1. **Baby-step Giant-step**: 時間・空間複雑性 \(O(\sqrt{n})\)
2. **Pollard ρ 法**: 時間複雑性 \(O(\sqrt{n})\)、空間複雑性 \(O(1)\)
3. **Pohlig-Hellman法**: 群の位数が小さな素因数に分解できる場合に有効
4. **指数計算法（Index Calculus）**: 有限体で \(O(e^{c(\log p)^{1/3}(\log\log p)^{2/3}})\)

#### 量子攻撃
- **Shor's algorithm**: 多項式時間 \(O((\log p)^3)\)
- **影響**: 楕円曲線暗号は量子計算に対して脆弱

#### 実装攻撃
- **サイドチャネル攻撃**: タイミング、電力消費、電磁波
- **故障攻撃**: 計算過程での故障を利用
- **対策**: 定数時間実装、乱数化、マスキング

### 実務の要点

#### パラメータ選択
- **有限体**: 2048ビット以上の素数
- **楕円曲線**: 256ビット以上の曲線
- **生成元**: 大きな位数を持つ元を選択

#### 鍵管理
- **Perfect Forward Secrecy**: 一時的な鍵を使用
- **鍵更新**: 定期的な鍵の更新
- **鍵確認**: 共有鍵の確認プロトコル

#### 実装ガイドライン
- **乱数生成**: 暗号学的安全な乱数を使用
- **定数時間**: サイドチャネル攻撃対策
- **入力検証**: 不正な入力の検出
- **エラーハンドリング**: 情報漏えいを防ぐ

### 代表的なプロトコル

#### TLS/SSL
- **ECDHE**: 楕円曲線Diffie-Hellman鍵共有
- **ECDSA**: 楕円曲線デジタル署名
- **鍵確認**: Finishedメッセージによる確認

#### SSH
- **ECDH**: 楕円曲線鍵共有
- **Ed25519**: Edwards曲線署名

#### ブロックチェーン
- **Bitcoin**: secp256k1曲線
- **Ethereum**: secp256k1曲線

### セキュリティ上の注意

#### 既知の脆弱性
- **小部分群攻撃**: 小さな部分群の存在を利用
- **MOV攻撃**: 超特異曲線での脆弱性
- **SSSA攻撃**: 特定の曲線での脆弱性

#### 推奨事項
- **標準曲線**: 十分に検証された曲線を使用
- **鍵長**: 現在の推奨鍵長を遵守
- **実装**: 検証済みライブラリを使用
- **監査**: 定期的なセキュリティ監査

### 参考資料
- RFC 7748（Curve25519 and Curve448）
- RFC 8032（Edwards-Curve Digital Signature Algorithm）
- NIST SP 800-56A（Key Agreement）
- Handbook of Applied Cryptography（Menezes, van Oorschot, Vanstone）
- Guide to Elliptic Curve Cryptography（Hankerson, Menezes, Vanstone）
