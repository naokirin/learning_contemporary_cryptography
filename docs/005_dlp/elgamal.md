# ElGamal暗号（ElGamal Encryption）

## 概要

ElGamal暗号は、1985年にTaher ElGamalによって提案された公開鍵暗号方式である。離散対数問題（DLP）の困難性に基づいており、Diffie-Hellman鍵共有を暗号化に応用した方式として知られている。

**特徴**:
- 非決定性暗号（同じ平文でも異なる暗号文を生成）
- 加法性を持つ（平文の積が暗号文の積に対応）
- 電子署名への応用が可能
- 楕円曲線版（EC-ElGamal）も存在

## 数学的基盤

### 離散対数問題（DLP）

有限体 \(\mathbb{F}_p\) の乗法群 \(\mathbb{F}_p^*\) において、生成元 \(g\) と \(h = g^x\) が与えられたとき、\(x = \log_g h\) を求める問題。

**形式的定義**:
- 入力: 素数 \(p\)、生成元 \(g \in \mathbb{F}_p^*\)、\(h \in \mathbb{F}_p^*\)
- 出力: \(g^x \equiv h \pmod{p}\) を満たす \(x \in \{0, 1, \ldots, p-2\}\)

### Diffie-Hellman問題

#### 計算的Diffie-Hellman問題（CDH）
**定義**: \(g^a, g^b\) が与えられたとき、\(g^{ab}\) を計算する問題

#### 判定的Diffie-Hellman問題（DDH）
**定義**: 与えられた3つ組 \((g^a, g^b, g^c)\) が \(c = ab\) を満たすかどうかを判定する問題

**問題間の関係**:
```
DLP ≤ CDH ≤ DDH
```

## ElGamal暗号の定義

### 鍵生成（Key Generation）

**パラメータ**:
- 素数 \(p\)（安全パラメータ）
- 生成元 \(g \in \mathbb{F}_p^*\)

**鍵生成アルゴリズム**:
1. 秘密鍵 \(x \in_R \{1, \ldots, p-2\}\) をランダムに選択
2. 公開鍵 \(y = g^x \bmod p\) を計算
3. 公開鍵: \((p, g, y)\)、秘密鍵: \(x\)

### 暗号化（Encryption）

**入力**: 平文 \(m \in \mathbb{F}_p^*\)

**暗号化アルゴリズム**:
1. 乱数 \(k \in_R \{1, \ldots, p-2\}\) をランダムに選択
2. \(c_1 = g^k \bmod p\) を計算
3. \(c_2 = m \cdot y^k \bmod p\) を計算
4. 暗号文: \((c_1, c_2)\)

**数学的表現**:
\[
(c_1, c_2) = (g^k, m \cdot g^{xk}) = (g^k, m \cdot y^k)
\]

### 復号化（Decryption）

**入力**: 暗号文 \((c_1, c_2)\)

**復号化アルゴリズム**:
1. \(s = c_1^x \bmod p\) を計算
2. \(s^{-1}\) を計算（\(s\) の逆元）
3. \(m = c_2 \cdot s^{-1} \bmod p\)

**数学的表現**:
\[
m = c_2 \cdot (c_1^x)^{-1} = c_2 \cdot (g^{kx})^{-1} = m \cdot g^{xk} \cdot g^{-xk} = m
\]

### 完全性の証明

復号化の正しさを証明する：

\[
\begin{align}
c_2 \cdot (c_1^x)^{-1} &= m \cdot y^k \cdot (g^{kx})^{-1} \\
&= m \cdot g^{xk} \cdot g^{-xk} \\
&= m \cdot g^{xk - xk} \\
&= m \cdot g^0 \\
&= m
\end{align}
\]

## 安全性解析

### 一方向性（One-Wayness）

**定義**: 暗号文 \((c_1, c_2)\) から平文 \(m\) を求めることが困難

**安全性**: CDH仮定の下で一方向性が保証される

**証明の概要**:
- 攻撃者が暗号文から平文を復元できると仮定
- これを利用してCDH問題を解くことができる
- CDH仮定に矛盾

### 意味論的安全性（Semantic Security）

**定義**: 暗号文から平文に関する部分情報を漏らさない

**安全性**: DDH仮定の下でIND-CPA安全

**証明の概要**:
- DDH問題の困難性を利用
- 攻撃者が暗号文の区別に成功した場合、DDH問題を解くことができる
- DDH仮定に矛盾

### 選択平文攻撃に対する安全性（IND-CPA）

**ゲーム定義**:
1. 攻撃者が2つの平文 \(m_0, m_1\) を選択
2. チャレンジャーが \(b \in_R \{0,1\}\) を選択し、\(m_b\) を暗号化
3. 攻撃者が暗号文から \(b\) を推測

**安全性**: DDH仮定の下でIND-CPA安全

### 加法性（Additive Homomorphism）

ElGamal暗号は加法性を持つ：

\[
E(m_1) \cdot E(m_2) = E(m_1 \cdot m_2)
\]

**証明**:
\[
\begin{align}
E(m_1) &= (g^{k_1}, m_1 \cdot y^{k_1}) \\
E(m_2) &= (g^{k_2}, m_2 \cdot y^{k_2}) \\
E(m_1) \cdot E(m_2) &= (g^{k_1 + k_2}, m_1 \cdot m_2 \cdot y^{k_1 + k_2}) \\
&= E(m_1 \cdot m_2)
\end{align}
\]

## ElGamal署名（ElGamal Digital Signature）

### 鍵生成

ElGamal暗号と同じ鍵生成を使用：
- 秘密鍵: \(x \in \{1, \ldots, p-2\}\)
- 公開鍵: \(y = g^x \bmod p\)

### 署名生成

**入力**: メッセージ \(m\)

**署名アルゴリズム**:
1. 乱数 \(k \in_R \{1, \ldots, p-2\}\) を選択（\(\gcd(k, p-1) = 1\)）
2. \(r = g^k \bmod p\) を計算
3. \(s = k^{-1}(m - xr) \bmod (p-1)\) を計算
4. 署名: \((r, s)\)

### 署名検証

**入力**: メッセージ \(m\)、署名 \((r, s)\)、公開鍵 \(y\)

**検証アルゴリズム**:
1. \(v_1 = g^m \bmod p\) を計算
2. \(v_2 = y^r \cdot r^s \bmod p\) を計算
3. \(v_1 = v_2\) ならば署名は有効

### 完全性の証明

署名検証の正しさを証明する：

\[
\begin{align}
v_2 &= y^r \cdot r^s \\
&= g^{xr} \cdot g^{ks} \\
&= g^{xr} \cdot g^{k \cdot k^{-1}(m - xr)} \\
&= g^{xr} \cdot g^{m - xr} \\
&= g^m \\
&= v_1
\end{align}
\]

## デジタル署名アルゴリズム（DSA）

### 概要

DSAはElGamal署名を改良した方式で、1994年にNISTによって標準化された。

### パラメータ

- 素数 \(p\)（1024ビット以上）
- 素数 \(q\)（160ビット以上、\(q \mid (p-1)\)）
- 生成元 \(g\)（\(g^q \equiv 1 \pmod{p}\)）

### 鍵生成

1. 秘密鍵 \(x \in_R \{1, \ldots, q-1\}\) を選択
2. 公開鍵 \(y = g^x \bmod p\) を計算

### 署名生成

**入力**: メッセージ \(m\)

**署名アルゴリズム**:
1. 乱数 \(k \in_R \{1, \ldots, q-1\}\) を選択
2. \(r = (g^k \bmod p) \bmod q\) を計算
3. \(s = k^{-1}(H(m) + xr) \bmod q\) を計算
4. 署名: \((r, s)\)

### 署名検証

**入力**: メッセージ \(m\)、署名 \((r, s)\)、公開鍵 \(y\)

**検証アルゴリズム**:
1. \(w = s^{-1} \bmod q\) を計算
2. \(u_1 = H(m) \cdot w \bmod q\) を計算
3. \(u_2 = r \cdot w \bmod q\) を計算
4. \(v = (g^{u_1} \cdot y^{u_2} \bmod p) \bmod q\) を計算
5. \(v = r\) ならば署名は有効

## 高速べき乗算（Fast Exponentiation）

### 素朴な方法（Naive Method）

**アルゴリズム**: 繰り返し乗算
```python
def naive_power(base, exponent, modulus):
    result = 1
    for i in range(exponent):
        result = (result * base) % modulus
    return result
```

**計算量**: \(O(n)\) 回の乗算（\(n\) は指数のビット長）

### バイナリ法（Binary Exponentiation）

**アルゴリズム**: 指数を2進展開して計算
```python
def binary_power(base, exponent, modulus):
    result = 1
    base = base % modulus
    while exponent > 0:
        if exponent % 2 == 1:
            result = (result * base) % modulus
        base = (base * base) % modulus
        exponent = exponent // 2
    return result
```

**計算量**: \(O(\log n)\) 回の乗算

### Shamirトリック（Shamir's Trick）

**概要**: 複数のべき乗を同時に計算する手法

**アルゴリズム**:
```python
def shamir_trick(g, h, a, b, p):
    # g^a * h^b を効率的に計算
    result = 1
    for i in range(max(a.bit_length(), b.bit_length())):
        if a & (1 << i):
            result = (result * g) % p
        if b & (1 << i):
            result = (result * h) % p
        g = (g * g) % p
        h = (h * h) % p
    return result
```

**利点**: 個別に計算するより効率的

### ウィンドウ法（Window Method）

**概要**: 複数ビットをまとめて処理

**アルゴリズム**:
```python
def window_power(base, exponent, modulus, window_size=4):
    # 事前計算
    table = [1]
    for i in range(1, 2**window_size):
        table.append((table[i-1] * base) % modulus)
    
    result = 1
    i = exponent.bit_length() - 1
    while i >= 0:
        # window_sizeビット分を処理
        window = 0
        for j in range(window_size):
            if i >= 0:
                window = (window << 1) | ((exponent >> i) & 1)
                i -= 1
        
        # 結果を更新
        for _ in range(window_size):
            result = (result * result) % modulus
        result = (result * table[window]) % modulus
    
    return result
```

## DSAにおける乱数の安全性

### 乱数の重要性

DSAでは、署名生成時に使用する乱数 \(k\) の安全性が重要である。

### 乱数の下位ビット漏洩攻撃

**攻撃シナリオ**: 乱数 \(k\) の下位ビットが漏洩した場合

**攻撃手法**:
1. \(k\) の下位 \(l\) ビットが既知: \(k = 2^l \cdot k' + k_0\)
2. DSA署名式: \(s = k^{-1}(H(m) + xr) \bmod q\)
3. これを変形: \(k = s^{-1}(H(m) + xr) \bmod q\)
4. 下位ビットの情報を利用して格子攻撃を実行

**格子攻撃の詳細**:
- 格子の次元: \(l\) ビット漏洩の場合、\(O(2^{l/2})\) の計算量
- 秘密鍵 \(x\) の復元が可能

### 対策

1. **暗号学的安全な乱数生成器の使用**
2. **乱数の再利用禁止**
3. **Deterministic DSA（RFC 6979）の採用**

### Deterministic DSA

**概要**: メッセージと秘密鍵から決定論的に乱数を生成

**アルゴリズム**:
```python
def deterministic_dsa_sign(m, x, p, q, g):
    # HMAC-DRBGを使用してkを生成
    k = hmac_drbg(m, x)
    r = pow(g, k, p) % q
    s = (pow(k, -1, q) * (hash(m) + x * r)) % q
    return (r, s)
```

## 否認不可署名（Undeniable Signature）

### 概要

否認不可署名は、署名者が署名の有効性を証明できない限り、署名を否認できない署名方式である。

### 基本的な否認不可署名

**鍵生成**:
- 秘密鍵: \(x \in \{1, \ldots, p-2\}\)
- 公開鍵: \(y = g^x \bmod p\)

**署名生成**:
- 乱数 \(k \in_R \{1, \ldots, p-2\}\) を選択
- 署名: \(s = g^{k^{-1}(m + x)} \bmod p\)

**確認プロトコル**:
1. 検証者が乱数 \(a, b\) を選択
2. 署名者が \(t = s^{a} \cdot g^{b} \bmod p\) を計算
3. 検証者が \(c = H(t)\) を送信
4. 署名者が \(d = a \cdot k^{-1}(m + x) + b \bmod (p-1)\) を送信
5. 検証者が \(g^d \equiv t \pmod{p}\) を確認

**否認プロトコル**:
- 署名者が署名が無効であることを証明
- ゼロ知識証明を利用

### Chaum-van Antwerpen署名

**特徴**:
- 強力な否認不可性
- 確認・否認プロトコルが存在
- 偽造困難性

**安全性**:
- 離散対数問題の困難性に基づく
- 確認プロトコルの完全性
- 否認プロトコルの健全性

## 実装上の注意点

### パラメータ選択

1. **素数 \(p\)**: 2048ビット以上推奨
2. **生成元 \(g\)**: 大きな位数を持つ元を選択
3. **乱数生成**: 暗号学的安全な乱数を使用

### サイドチャネル攻撃対策

1. **定数時間実装**: タイミング攻撃対策
2. **電力解析対策**: マスキング技術
3. **故障攻撃対策**: 冗長性の導入

### 効率化手法

1. **中国剰余定理（CRT）**: 大きな数の計算効率化
2. **Montgomery乗算**: モジュラー乗算の高速化
3. **楕円曲線版**: 鍵長短縮と計算効率向上

## 応用例

### 電子投票

ElGamal暗号の加法性を利用した電子投票システム

### 秘密計算

準同型性を利用した秘密計算プロトコル

### ブロックチェーン

楕円曲線版ElGamalの応用

## まとめ

ElGamal暗号は、離散対数問題の困難性に基づく堅牢な公開鍵暗号方式である。その非決定性、加法性、署名への応用可能性により、現代暗号学において重要な役割を果たしている。適切なパラメータ選択と実装により、高い安全性を提供できる。

**主要なポイント**:
- DDH仮定の下でIND-CPA安全
- 加法性を持つ準同型暗号
- 電子署名への直接応用が可能
- 乱数の安全性が重要
- 否認不可署名への拡張が可能
