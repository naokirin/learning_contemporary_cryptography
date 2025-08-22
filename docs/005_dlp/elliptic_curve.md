# 楕円曲線暗号（Elliptic Curve Cryptography）

## 概要

楕円曲線暗号（ECC: Elliptic Curve Cryptography）は、楕円曲線上の離散対数問題の困難性に基づく暗号方式です。有限体上の楕円曲線の群構造を利用し、従来の有限体上の離散対数問題と比較して、より短い鍵長で同等の安全性を実現できます。

**主要特徴**:
- 短い鍵長で高い安全性（256ビット楕円曲線 ≈ 3072ビットRSA）
- 効率的な計算（点のスカラー倍算）
- メモリ効率が良い
- 量子計算に対する脆弱性（Shor's algorithm）

## 楕円曲線の定義

### 基本定義

有限体 \(\mathbb{F}_p\) 上の楕円曲線 \(E(\mathbb{F}_p)\) は、以下の方程式で定義されます：

\[y^2 = x^3 + ax + b \pmod{p}\]

ただし：
- \(a, b \in \mathbb{F}_p\) は曲線パラメータ
- \(4a^3 + 27b^2 \not\equiv 0 \pmod{p}\)（特異点を持たない条件）
- \(p > 3\) は素数

### 点の集合

楕円曲線上の点の集合は：
\[E(\mathbb{F}_p) = \{(x, y) \in \mathbb{F}_p \times \mathbb{F}_p : y^2 = x^3 + ax + b\} \cup \{\mathcal{O}\}\]

ここで \(\mathcal{O}\) は無限遠点（単位元）です。

### 例：secp256k1曲線

Bitcoinで使用されるsecp256k1曲線のパラメータ：
- \(p = 2^{256} - 2^{32} - 2^9 - 2^8 - 2^7 - 2^6 - 2^4 - 1\)
- \(a = 0\)
- \(b = 7\)
- 方程式：\(y^2 = x^3 + 7\)

## 楕円曲線の性質

### 群構造

楕円曲線上の点の集合は、以下の演算で群を形成します：

#### 点の加法

点 \(P = (x_1, y_1)\) と \(Q = (x_2, y_2)\) の和 \(R = P + Q = (x_3, y_3)\)：

**\(P \neq Q\) の場合**:
\[\lambda = \frac{y_2 - y_1}{x_2 - x_1} \pmod{p}\]
\[x_3 = \lambda^2 - x_1 - x_2 \pmod{p}\]
\[y_3 = \lambda(x_1 - x_3) - y_1 \pmod{p}\]

**\(P = Q\) の場合（倍点）**:
\[\lambda = \frac{3x_1^2 + a}{2y_1} \pmod{p}\]
\[x_3 = \lambda^2 - 2x_1 \pmod{p}\]
\[y_3 = \lambda(x_1 - x_3) - y_1 \pmod{p}\]

#### 単位元と逆元

- **単位元**: 無限遠点 \(\mathcal{O}\)
- **逆元**: 点 \(P = (x, y)\) の逆元は \(-P = (x, -y)\)

### 位数と生成元

#### 曲線の位数

楕円曲線 \(E(\mathbb{F}_p)\) の位数（点の総数）は、Hasseの定理により：

\[p + 1 - 2\sqrt{p} \leq |E(\mathbb{F}_p)| \leq p + 1 + 2\sqrt{p}\]

#### 生成元

楕円曲線上の点 \(G\) が生成元であるとは、\(G\) の位数が曲線の位数と等しいことを意味します。

**例：secp256k1の生成元**:
```
G = (55066263022277343669578718895168534326250603453777594175500187360389116729240,
     32670510020758816978083085130507043184471273380659243275938904335757337482424)
```

## ECDH鍵共有方式

### 基本プロトコル

楕円曲線Diffie-Hellman（ECDH）鍵共有は、楕円曲線上の離散対数問題の困難性に基づきます。

#### 共通パラメータ

- 楕円曲線 \(E(\mathbb{F}_p)\)
- 生成元 \(G \in E(\mathbb{F}_p)\)
- 曲線の位数 \(n\)

#### 鍵共有手順

1. **Aliceの鍵生成**:
   - 秘密鍵: \(a \in_R \{1, 2, \ldots, n-1\}\)
   - 公開値: \(A = aG\)

2. **Bobの鍵生成**:
   - 秘密鍵: \(b \in_R \{1, 2, \ldots, n-1\}\)
   - 公開値: \(B = bG\)

3. **鍵共有**:
   - Alice: \(K = aB = a(bG) = abG\)
   - Bob: \(K = bA = b(aG) = abG\)

#### 具体例

secp256k1曲線を使用したECDH鍵共有：

```python
# 共通パラメータ
p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
G = (0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798,
     0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8)
n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141

# Alice
a = 0x1234567890ABCDEF  # 秘密鍵
A = a * G  # 公開値

# Bob
b = 0xFEDCBA0987654321  # 秘密鍵
B = b * G  # 公開値

# 共有鍵
K_Alice = a * B  # = abG
K_Bob = b * A    # = abG
```

### 安全性の議論

#### 楕円曲線上のDiffie-Hellman問題（ECDH）

**計算的楕円曲線Diffie-Hellman問題（ECCDH）**:
- 入力: \((G, aG, bG)\) where \(a, b \in_R \{1, \ldots, n-1\}\)
- 出力: \(abG\)

**判定的楕円曲線Diffie-Hellman問題（ECDDH）**:
- 入力: \((G, aG, bG, cG)\) where \(a, b, c \in_R \{1, \ldots, n-1\}\)
- 出力: \(c = ab\) かどうかの判定

#### 楕円曲線上の離散対数問題（ECDLP）

**定義**: 楕円曲線上の点 \(P\) と \(Q = xP\) が与えられたとき、\(x\) を求める問題

**形式的定義**:
- 入力: 楕円曲線 \(E(\mathbb{F}_p)\)、生成元 \(G\)、点 \(Q = xG\)
- 出力: \(x \in \{0, 1, \ldots, n-1\}\)

#### 問題間の関係性

```
ECDLP ≤ ECCDH ≤ ECDDH
```

- **ECDLP ≤ ECCDH**: ECDLPを解ければECCDHも解ける
- **ECCDH ≤ ECDDH**: ECCDHを解ければECDDHも解ける
- 逆方向は一般に成り立たない

#### 計算困難性

**古典計算**:
- Baby-step Giant-step: \(O(\sqrt{n})\) 時間・空間
- Pollard's rho: \(O(\sqrt{n})\) 時間、\(O(1)\) 空間
- 現在の推奨: 256ビット以上の曲線

**量子計算**:
- Shor's algorithm: \(O((\log n)^3)\) 時間
- 楕円曲線暗号は量子計算に対して脆弱

## 楕円曲線暗号の安全性

### 安全性仮定

#### 1. 楕円曲線離散対数問題（ECDLP）

**仮定**: 適切に選択された楕円曲線において、ECDLPは計算困難

**条件**:
- 曲線の位数が大きな素数因子を持つ
- 埋め込み次数が十分大きい
- 既知の攻撃手法に耐性がある

#### 2. 楕円曲線Diffie-Hellman問題

**ECCDH仮定**: 適切な楕円曲線において、ECCDHは計算困難

**ECDDH仮定**: 適切な楕円曲線において、ECDDHは計算困難

### 攻撃手法と対策

#### 既知の攻撃

1. **Baby-step Giant-step攻撃**:
   - 複雑性: \(O(\sqrt{n})\) 時間・空間
   - 対策: 十分大きな位数の曲線を使用

2. **Pollard's rho攻撃**:
   - 複雑性: \(O(\sqrt{n})\) 時間
   - 対策: 大きな素数位数の曲線を使用

3. **Pohlig-Hellman攻撃**:
   - 複雑性: 群の位数の最大素因数に依存
   - 対策: 位数が大きな素数である曲線を使用

4. **MOV攻撃**:
   - 対象: 埋め込み次数が小さい超特異曲線
   - 対策: 非超特異曲線を使用

5. **SSSA攻撃**:
   - 対象: 特定の異常曲線
   - 対策: 標準曲線を使用

#### 実装攻撃

1. **サイドチャネル攻撃**:
   - タイミング攻撃
   - 電力解析攻撃
   - 電磁波解析攻撃

2. **故障攻撃**:
   - 計算過程での故障を利用

3. **対策**:
   - 定数時間実装
   - 乱数化
   - マスキング

### 推奨曲線

#### NIST推奨曲線

- **P-256**: 256ビット、広く採用
- **P-384**: 384ビット、高セキュリティ
- **P-521**: 521ビット、最高セキュリティ

#### 現代的な曲線

- **Curve25519**: 255ビット、高速実装
- **Curve448**: 448ビット、高セキュリティ
- **secp256k1**: 256ビット、Bitcoinで使用

## 効率的な計算

### 座標系

#### アフィン座標

標準的な座標系 \((x, y)\)：

**点の加法**（\(P \neq Q\)）:
```python
def point_add_affine(P, Q, p):
    x1, y1 = P
    x2, y2 = Q
    
    if x1 == x2 and y1 == -y2:
        return None  # 無限遠点
    
    if P == Q:
        # 倍点
        lam = (3 * x1 * x1) * pow(2 * y1, -1, p) % p
    else:
        # 点の加法
        lam = (y2 - y1) * pow(x2 - x1, -1, p) % p
    
    x3 = (lam * lam - x1 - x2) % p
    y3 = (lam * (x1 - x3) - y1) % p
    
    return (x3, y3)
```

**欠点**: 逆元計算が高コスト

#### 射影座標

同次座標 \((X, Y, Z)\) で \(x = X/Z, y = Y/Z\)：

**利点**:
- 逆元計算を回避
- 点の加法で逆元が不要

**点の加法**:
```python
def point_add_projective(P, Q, p):
    X1, Y1, Z1 = P
    X2, Y2, Z2 = Q
    
    # 中間計算
    U1 = X1 * Z2 % p
    U2 = X2 * Z1 % p
    S1 = Y1 * Z2 % p
    S2 = Y2 * Z1 % p
    
    if U1 == U2:
        if S1 != S2:
            return None  # 無限遠点
        # 倍点計算
        return point_double_projective(P, p)
    
    H = U2 - U1
    r = S2 - S1
    H2 = H * H % p
    H3 = H2 * H % p
    U1H2 = U1 * H2 % p
    
    X3 = (r * r - H3 - 2 * U1H2) % p
    Y3 = (r * (U1H2 - X3) - S1 * H3) % p
    Z3 = Z1 * Z2 * H % p
    
    return (X3, Y3, Z3)
```

#### Jacobian座標

座標 \((X, Y, Z)\) で \(x = X/Z^2, y = Y/Z^3\)：

**利点**:
- 倍点計算が効率的
- 点の加法も高速

**倍点計算**:
```python
def point_double_jacobian(P, p, a):
    X1, Y1, Z1 = P
    
    if Y1 == 0:
        return None  # 無限遠点
    
    Y1Z1 = Y1 * Z1 % p
    Z3 = 2 * Y1Z1 % p
    S = 4 * X1 * Y1 * Y1 % p
    M = (3 * X1 * X1 + a * Z1 * Z1 * Z1 * Z1) % p
    
    X3 = (M * M - 2 * S) % p
    Y3 = (M * (S - X3) - 8 * Y1 * Y1 * Y1 * Y1) % p
    
    return (X3, Y3, Z3)
```

### スカラー倍算の高速化

#### Double-and-Add法

基本的なスカラー倍算アルゴリズム：

```python
def scalar_multiply_basic(k, P, p):
    Q = None  # 無限遠点
    
    for i in range(k.bit_length()):
        if k & (1 << i):
            Q = point_add(Q, P, p)
        P = point_double(P, p)
    
    return Q
```

#### 符号付きバイナリ法（NAF: Non-Adjacent Form）

スカラーを符号付きバイナリ表現に変換し、非零ビットを減らす：

**NAF変換**:
```python
def to_naf(k):
    naf = []
    while k > 0:
        if k % 2 == 1:
            naf.append(2 - (k % 4))
            k = k - naf[-1]
        else:
            naf.append(0)
        k = k // 2
    return naf

def scalar_multiply_naf(k, P, p):
    naf = to_naf(k)
    Q = None
    
    for i in range(len(naf) - 1, -1, -1):
        Q = point_double(Q, p)
        if naf[i] == 1:
            Q = point_add(Q, P, p)
        elif naf[i] == -1:
            Q = point_add(Q, point_negate(P), p)
    
    return Q
```

#### ウィンドウ法

複数ビットを同時に処理：

```python
def scalar_multiply_window(k, P, p, w=4):
    # 事前計算
    table = [None] * (1 << w)
    table[0] = None
    table[1] = P
    
    for i in range(2, 1 << w):
        table[i] = point_add(table[i-1], P, p)
    
    # スカラー倍算
    Q = None
    for i in range(k.bit_length() - 1, -1, -w):
        Q = point_double(Q, p)
        if i >= w - 1:
            window = (k >> (i - w + 1)) & ((1 << w) - 1)
        else:
            window = k & ((1 << w) - 1)
        
        if window > 0:
            Q = point_add(Q, table[window], p)
    
    return Q
```

### Montgomery曲線

Montgomery曲線 \(By^2 = x^3 + Ax^2 + x\) を使用した高速実装：

**利点**:
- 点の加法が効率的
- 定数時間実装が容易
- サイドチャネル攻撃に強い

**Montgomery ladder**:
```python
def montgomery_ladder(k, P, p):
    X1, Z1 = P
    X2, Z2 = point_double_montgomery(P, p)
    
    for i in range(k.bit_length() - 2, -1, -1):
        if (k >> i) & 1:
            X1, Z1 = point_add_montgomery(X1, Z1, X2, Z2, P, p)
            X2, Z2 = point_double_montgomery(X2, Z2, p)
        else:
            X2, Z2 = point_add_montgomery(X2, Z2, X1, Z1, P, p)
            X1, Z1 = point_double_montgomery(X1, Z1, p)
    
    return X1, Z1
```

## 実装攻撃に対するランダム化

### サイドチャネル攻撃対策

#### 1. 定数時間実装

**条件分岐の排除**:
```python
def constant_time_select(condition, a, b):
    """定数時間での条件選択"""
    mask = -condition  # 全ビットが1または0
    return (a & mask) | (b & ~mask)

def point_add_constant_time(P, Q, p):
    """定数時間点の加法"""
    # 条件分岐を排除した実装
    is_infinity = (P is None) | (Q is None)
    
    # 常に計算を実行
    result = point_add_internal(P, Q, p)
    
    # 条件に応じて結果を選択
    return constant_time_select(is_infinity, None, result)
```

#### 2. 乱数化

**スカラー乱数化**:
```python
def scalar_multiply_randomized(k, P, p, n):
    """乱数化されたスカラー倍算"""
    # 乱数を生成
    r = random.randint(1, n - 1)
    
    # 乱数化されたスカラー
    k_randomized = (k + r * n) % n
    
    # スカラー倍算
    Q = scalar_multiply(k_randomized, P, p)
    
    return Q
```

**点の乱数化**:
```python
def point_randomize(P, p):
    """点の座標を乱数化"""
    if P is None:
        return None
    
    x, y = P
    # 射影座標に変換
    z = random.randint(1, p - 1)
    X = x * z % p
    Y = y * z % p
    Z = z
    
    return (X, Y, Z)
```

#### 3. マスキング

**加法マスキング**:
```python
def masked_scalar_multiply(k, P, p):
    """マスキングされたスカラー倍算"""
    # マスクを生成
    mask = random.randint(1, p - 1)
    
    # マスクされたスカラー
    k_masked = (k + mask) % p
    
    # マスクされた点
    P_masked = point_multiply(mask, P, p)
    
    # 計算
    Q_masked = scalar_multiply(k_masked, P, p)
    Q = point_subtract(Q_masked, P_masked, p)
    
    return Q
```

### 故障攻撃対策

#### 1. 冗長計算

**二重計算**:
```python
def fault_tolerant_scalar_multiply(k, P, p):
    """故障耐性スカラー倍算"""
    # 二重計算
    Q1 = scalar_multiply(k, P, p)
    Q2 = scalar_multiply(k, P, p)
    
    # 結果の検証
    if Q1 != Q2:
        raise ValueError("Fault detected")
    
    return Q1
```

#### 2. 結果検証

**検証計算**:
```python
def verified_scalar_multiply(k, P, p, n):
    """検証付きスカラー倍算"""
    Q = scalar_multiply(k, P, p)
    
    # 検証: kP + (n-k)P = O
    k_inv = n - k
    Q_inv = scalar_multiply(k_inv, P, p)
    verification = point_add(Q, Q_inv, p)
    
    if verification is not None:
        raise ValueError("Verification failed")
    
    return Q
```

### 実装のベストプラクティス

#### 1. 入力検証

```python
def validate_point(P, p, a, b):
    """楕円曲線上の点の検証"""
    if P is None:
        return True  # 無限遠点
    
    x, y = P
    
    # 座標の範囲チェック
    if not (0 <= x < p and 0 <= y < p):
        return False
    
    # 曲線上の点かチェック
    lhs = (y * y) % p
    rhs = (x * x * x + a * x + b) % p
    
    return lhs == rhs
```

#### 2. 定数時間比較

```python
def constant_time_equals(a, b):
    """定数時間での等価性チェック"""
    if len(a) != len(b):
        return False
    
    result = 0
    for i in range(len(a)):
        result |= a[i] ^ b[i]
    
    return result == 0
```

#### 3. メモリクリア

```python
def secure_clear(data):
    """機密データの安全な消去"""
    if isinstance(data, (list, tuple)):
        for item in data:
            secure_clear(item)
    elif isinstance(data, bytearray):
        for i in range(len(data)):
            data[i] = 0
    elif hasattr(data, '__dict__'):
        for attr in data.__dict__:
            secure_clear(getattr(data, attr))
```

## 実装例

### Python実装

```python
import random
from typing import Optional, Tuple

class EllipticCurve:
    def __init__(self, p: int, a: int, b: int, G: Tuple[int, int], n: int):
        self.p = p
        self.a = a
        self.b = b
        self.G = G
        self.n = n
    
    def point_add(self, P: Optional[Tuple[int, int]], 
                  Q: Optional[Tuple[int, int]]) -> Optional[Tuple[int, int]]:
        """楕円曲線上の点の加法"""
        if P is None:
            return Q
        if Q is None:
            return P
        
        x1, y1 = P
        x2, y2 = Q
        
        if x1 == x2 and y1 == -y2 % self.p:
            return None  # 無限遠点
        
        if P == Q:
            # 倍点
            lam = (3 * x1 * x1 + self.a) * pow(2 * y1, -1, self.p) % self.p
        else:
            # 点の加法
            lam = (y2 - y1) * pow(x2 - x1, -1, self.p) % self.p
        
        x3 = (lam * lam - x1 - x2) % self.p
        y3 = (lam * (x1 - x3) - y1) % self.p
        
        return (x3, y3)
    
    def scalar_multiply(self, k: int, P: Optional[Tuple[int, int]]) -> Optional[Tuple[int, int]]:
        """スカラー倍算（double-and-add法）"""
        if P is None:
            return None
        
        Q = None
        for i in range(k.bit_length()):
            if k & (1 << i):
                Q = self.point_add(Q, P)
            P = self.point_add(P, P)
        
        return Q
    
    def ecdh_key_exchange(self, private_key: int, public_key: Tuple[int, int]) -> Optional[Tuple[int, int]]:
        """ECDH鍵共有"""
        return self.scalar_multiply(private_key, public_key)

# secp256k1曲線の例
secp256k1 = EllipticCurve(
    p=0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F,
    a=0,
    b=7,
    G=(0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798,
       0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8),
    n=0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
)
```

### 実装の注意点

1. **乱数生成**: 暗号学的安全な乱数を使用
2. **定数時間**: サイドチャネル攻撃対策
3. **入力検証**: 不正な入力の検出
4. **エラーハンドリング**: 情報漏えいを防ぐ
5. **メモリ管理**: 機密データの安全な消去

## まとめ

楕円曲線暗号は、現代の暗号技術において重要な役割を果たしています。短い鍵長で高い安全性を実現し、効率的な計算が可能です。しかし、実装においては様々な攻撃手法に対する対策が必要です。

**主要なポイント**:
- 楕円曲線の数学的基盤の理解
- 適切な曲線パラメータの選択
- 効率的なスカラー倍算アルゴリズム
- サイドチャネル攻撃対策
- 定数時間実装の重要性

楕円曲線暗号の実装は、数学的な正確性と実装の安全性の両方を考慮する必要があります。
