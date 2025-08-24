# IDベース暗号（Identity-Based Encryption）

## 概要

IDベース暗号（IBE: Identity-Based Encryption）は、1984年にShamirによって提案された暗号方式の概念で、任意の文字列（メールアドレス、ドメイン名、IPアドレスなど）を公開鍵として使用できる暗号システムです。

### 従来の公開鍵暗号との違い

**従来の公開鍵暗号**:
- 公開鍵はランダムな値
- 証明書が必要（PKI: Public Key Infrastructure）
- 鍵管理が複雑

**IDベース暗号**:
- 公開鍵は意味のある文字列（ID）
- 証明書が不要
- 鍵管理が簡素化

### 主要な特徴

1. **任意のIDを公開鍵として使用**
   - 例：`alice@company.com`、`server.example.com`
   - 事前の鍵生成が不要

2. **秘密鍵生成センター（PKG: Private Key Generator）**
   - マスター秘密鍵を保持
   - 各ユーザーの秘密鍵を生成・配布

3. **双線型ペアリング写像**
   - 数学的基盤として使用
   - 楕円曲線上の特殊な写像

## 基本的な構成方法

### 1. 共通パラメータ生成（Setup）

システム全体で共有されるパラメータを生成します。

```typescript
interface IBESetup {
  // 双線型ペアリング写像のパラメータ
  G1: EllipticCurveGroup;  // 加法群
  G2: EllipticCurveGroup;  // 加法群  
  GT: MultiplicativeGroup; // 乗法群
  e: Pairing;              // 双線型ペアリング写像
  
  // 公開パラメータ
  P: Point;                // G1の生成元
  Ppub: Point;             // マスター公開鍵 = sP
  
  // マスター秘密鍵（PKGのみが保持）
  s: BigInt;               // マスター秘密鍵
}
```

**アルゴリズム**:
1. 素数位数 \(q\) の群 \(G_1, G_2, G_T\) を生成
2. 双線型ペアリング写像 \(e: G_1 \times G_2 \rightarrow G_T\) を設定
3. \(G_1\) の生成元 \(P\) を選択
4. マスター秘密鍵 \(s \in_R \mathbb{Z}_q^*\) をランダムに選択
5. マスター公開鍵 \(P_{pub} = sP\) を計算
6. ハッシュ関数 \(H_1: \{0,1\}^* \rightarrow G_1^*\) を設定

### 2. 秘密鍵生成（Extract）

ユーザーのIDに対応する秘密鍵を生成します。

```typescript
interface IBEExtract {
  ID: string;              // ユーザーのID
  dID: Point;              // IDに対応する秘密鍵
}
```

**アルゴリズム**:
1. IDをハッシュ関数で変換: \(Q_{ID} = H_1(ID)\)
2. 秘密鍵を計算: \(d_{ID} = sQ_{ID}\)

**数学的説明**:
- \(Q_{ID} = H_1(ID)\) はIDから \(G_1\) の点への写像
- \(d_{ID} = sQ_{ID}\) はマスター秘密鍵 \(s\) によるスカラー倍
- 双線型性により: \(e(d_{ID}, P) = e(sQ_{ID}, P) = e(Q_{ID}, sP) = e(Q_{ID}, P_{pub})\)

### 3. 暗号化（Encrypt）

メッセージをIDを使用して暗号化します。

```typescript
interface IBEEncrypt {
  message: string;         // 平文メッセージ
  ID: string;              // 受信者のID
  ciphertext: {
    U: Point;              // ランダム点
    V: string;             // 暗号文
  };
}
```

**アルゴリズム**:
1. ランダム値 \(r \in_R \mathbb{Z}_q^*\) を選択
2. \(U = rP\) を計算
3. \(Q_{ID} = H_1(ID)\) を計算
4. 共有鍵を計算: \(g_{ID} = e(Q_{ID}, P_{pub})^r\)
5. メッセージを暗号化: \(V = M \oplus H_2(g_{ID})\)
   - \(H_2: G_T \rightarrow \{0,1\}^n\) はハッシュ関数

**数学的説明**:
- 共有鍵: \(g_{ID} = e(Q_{ID}, P_{pub})^r = e(Q_{ID}, sP)^r = e(Q_{ID}, P)^{rs}\)
- 双線型性により: \(e(d_{ID}, U) = e(sQ_{ID}, rP) = e(Q_{ID}, P)^{rs} = g_{ID}\)

### 4. 復号化（Decrypt）

秘密鍵を使用して暗号文を復号化します。

```typescript
interface IBEDecrypt {
  ciphertext: {
    U: Point;              // 暗号文の一部
    V: string;             // 暗号文の一部
  };
  dID: Point;              // 受信者の秘密鍵
  message: string;         // 復号された平文
}
```

**アルゴリズム**:
1. 共有鍵を計算: \(g_{ID} = e(d_{ID}, U)\)
2. メッセージを復号: \(M = V \oplus H_2(g_{ID})\)

**数学的説明**:
- \(e(d_{ID}, U) = e(sQ_{ID}, rP) = e(Q_{ID}, P)^{rs} = g_{ID}\)
- 暗号化時の共有鍵と一致するため、正しく復号できる

## 安全性

### 一方向性とBDH問題の困難性

IDベース暗号の安全性は、**双線型Diffie-Hellman問題（BDH: Bilinear Diffie-Hellman Problem）** の困難性に基づいています。

#### BDH問題の定義

**入力**: \((P, aP, bP, cP)\) where \(a, b, c \in_R \mathbb{Z}_q^*\)
**出力**: \(e(P, P)^{abc}\)

**困難性**: 与えられた点から \(e(P, P)^{abc}\) を計算することは困難

#### 一方向性の証明

IDベース暗号が一方向性を持つためには、BDH問題が困難である必要があります。

**攻撃モデル**:
- 攻撃者は公開パラメータ \((G_1, G_2, G_T, e, P, P_{pub})\) を知っている
- 攻撃者は任意のIDに対する秘密鍵を取得できる（オラクルアクセス）
- 攻撃者は特定のIDに対する暗号文を復号しようとする

**帰着証明**:
1. BDH問題のインスタンス \((P, aP, bP, cP)\) が与えられる
2. IDベース暗号の公開パラメータを \(P_{pub} = aP\) として設定
3. 攻撃者がID \(H\) に対する暗号文を復号できれば、\(e(P, P)^{abc}\) が計算できる
4. これはBDH問題を解くことと等価

### 双線型ペアリング写像の一方向性

双線型ペアリング写像 \(e: G_1 \times G_2 \rightarrow G_T\) は以下の性質を持ちます：

1. **双線型性**: \(e(aP, bQ) = e(P, Q)^{ab}\)
2. **非退化性**: \(e(P, Q) \neq 1\) for \(P \neq 0, Q \neq 0\)
3. **計算可能性**: \(e(P, Q)\) は効率的に計算可能

**一方向性**:
- \(e(P, Q)\) から \(P\) や \(Q\) を求めることは困難
- これは楕円曲線上の離散対数問題の困難性に基づく

### 任意のIDに対する秘密鍵を返答するオラクルを用いた攻撃

#### 適応的選択暗号文攻撃（CCA2）

攻撃者は復号オラクルを使用して、任意の暗号文を復号できます（ただし、攻撃対象の暗号文は除く）。

**攻撃モデル**:
1. 攻撃者は公開パラメータを取得
2. 攻撃者は任意のIDに対する秘密鍵を取得できる
3. 攻撃者は復号オラクルを使用できる
4. 攻撃者は特定のIDに対する暗号文を復号しようとする

#### 安全性の証明

**定理**: BDH問題が困難であれば、IDベース暗号は適応的選択暗号文攻撃に対して安全です。

**証明の概要**:
1. **ゲーム0**: 実際の攻撃ゲーム
2. **ゲーム1**: 復号オラクルの応答を変更
3. **ゲーム2**: ハッシュ関数の応答を変更
4. **ゲーム3**: BDH問題のインスタンスを埋め込み

各ゲーム間の差が無視できることを示し、最終的にBDH問題の困難性に帰着させます。

#### 実装上の注意点

1. **鍵エスクロー問題**: PKGが全ての秘密鍵を知っている
2. **鍵更新**: 秘密鍵の漏洩時は全システムの再設定が必要
3. **分散化**: 複数のPKGによる分散化が研究されている

#### CRYPTRECによる調査報告

日本の暗号技術検討会（CRYPTREC）は、2008年に「[IDベース暗号に関する調査報告書](https://www.cryptrec.go.jp/tech_reports.html)」を公表し、IDベース暗号の安全性と実用性について包括的な調査を行いました。

**主な調査内容**:
- **攻撃手法の分析**: 適応的選択暗号文攻撃を含む各種攻撃手法の詳細な分析
- **実装上の脆弱性**: 実際の実装における潜在的な脆弱性の特定
- **鍵管理の課題**: PKGの単一障害点と鍵エスクロー問題の評価
- **標準化動向**: 国際的な標準化活動と日本の対応状況

**調査結果の要点**:
1. **理論的安全性**: 数学的な安全性証明は確立されているが、実装上の課題が存在
2. **攻撃耐性**: 適応的選択暗号文攻撃に対する安全性は理論的に証明されている
3. **実用性の制約**: 鍵エスクロー問題により、特定用途でのみ適用が推奨
4. **将来展望**: 分散化技術の発展により実用性が向上する可能性

**推奨事項**:
- 実装時は十分なセキュリティ監査を実施
- 鍵管理の分散化を検討
- 定期的なセキュリティ評価の実施
- 国際標準との整合性確保

この調査報告書は、IDベース暗号の実用化における重要な参考資料として位置づけられており、特に日本の暗号技術政策において重要な役割を果たしています。

## 双線型ペアリング写像の計算方法

### 楕円曲線上のペアリング

#### Tateペアリング

最も一般的なペアリング写像の一つです。

**定義**: \(e: E(\mathbb{F}_q)[r] \times E(\mathbb{F}_{q^k})/rE(\mathbb{F}_{q^k}) \rightarrow \mathbb{F}_{q^k}^*/(\mathbb{F}_{q^k}^*)^r\)

**計算アルゴリズム**:
```typescript
function tatePairing(P: Point, Q: Point, r: BigInt, k: number): FieldElement {
  let f = 1;
  let T = P;
  
  for (let i = r.bitLength() - 2; i >= 0; i--) {
    f = f * f * lineFunction(T, T, Q);
    T = 2 * T;
    
    if (r.testBit(i)) {
      f = f * lineFunction(T, P, Q);
      T = T + P;
    }
  }
  
  return f ^ ((q^k - 1) / r);
}
```

#### Weilペアリング

Tateペアリングの特殊な場合です。

**定義**: \(e: E(\mathbb{F}_q)[r] \times E(\mathbb{F}_q)[r] \rightarrow \mu_r\)

**計算式**: \(e(P, Q) = \frac{f_{r,P}(Q + S)}{f_{r,P}(S)}\) where \(S\) は適当な点

### 効率的な実装

#### Miller's Algorithm

ペアリング計算の効率的なアルゴリズムです。

```typescript
function millersAlgorithm(P: Point, Q: Point, r: BigInt): FieldElement {
  let f = 1;
  let T = P;
  
  for (let i = r.bitLength() - 2; i >= 0; i--) {
    // 倍算ステップ
    let l = tangentLine(T, Q);
    f = f * f * l;
    T = 2 * T;
    
    // 加算ステップ（必要に応じて）
    if (r.testBit(i)) {
      let l = lineThroughPoints(T, P, Q);
      f = f * l;
      T = T + P;
    }
  }
  
  return f;
}
```

#### 最適化技術

1. **最終べき乗**: \(f^{(q^k-1)/r}\) の計算
2. **分母消去**: 分母の計算を回避
3. **射影座標**: 逆元計算を削減

### 実装例

```typescript
class PairingBasedIBE {
  private G1: EllipticCurveGroup;
  private G2: EllipticCurveGroup;
  private GT: MultiplicativeGroup;
  private e: Pairing;
  private P: Point;
  private Ppub: Point;
  private s: BigInt;
  
  constructor() {
    // ペアリング設定
    this.setupPairing();
  }
  
  private setupPairing(): void {
    // BN曲線などのペアリングフレンドリー曲線を使用
    this.G1 = new EllipticCurveGroup(/* パラメータ */);
    this.G2 = new EllipticCurveGroup(/* パラメータ */);
    this.GT = new MultiplicativeGroup(/* パラメータ */);
    this.e = new TatePairing(this.G1, this.G2, this.GT);
    
    // 生成元とマスター鍵
    this.P = this.G1.generator();
    this.s = this.randomBigInt();
    this.Ppub = this.G1.scalarMultiply(this.s, this.P);
  }
  
  public extract(ID: string): Point {
    const QID = this.hashToPoint(ID);
    return this.G1.scalarMultiply(this.s, QID);
  }
  
  public encrypt(message: string, ID: string): Ciphertext {
    const r = this.randomBigInt();
    const U = this.G1.scalarMultiply(r, this.P);
    
    const QID = this.hashToPoint(ID);
    const gID = this.e.compute(QID, this.Ppub).pow(r);
    
    const V = this.xor(message, this.hash(gID));
    
    return { U, V };
  }
  
  public decrypt(ciphertext: Ciphertext, dID: Point): string {
    const gID = this.e.compute(dID, ciphertext.U);
    return this.xor(ciphertext.V, this.hash(gID));
  }
  
  private hashToPoint(ID: string): Point {
    // IDを楕円曲線上の点に変換
    return this.G1.hashToPoint(ID);
  }
  
  private hash(element: FieldElement): string {
    // 群要素をハッシュ化
    return sha256(element.toBytes());
  }
  
  private xor(a: string, b: string): string {
    // XOR演算
    const result = new Uint8Array(Math.max(a.length, b.length));
    for (let i = 0; i < result.length; i++) {
      result[i] = (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
    }
    return String.fromCharCode(...result);
  }
}
```

### 性能と実用性

#### 計算コスト

1. **ペアリング計算**: 最も重い操作（数ミリ秒）
2. **楕円曲線演算**: スカラー倍算（数百マイクロ秒）
3. **ハッシュ計算**: 最も軽い操作（数マイクロ秒）

#### 鍵長の比較

| 暗号方式 | セキュリティレベル | 公開鍵長  | 秘密鍵長  |
| -------- | ------------------ | --------- | --------- |
| RSA-2048 | 112ビット          | 256バイト | 256バイト |
| ECC-256  | 128ビット          | 32バイト  | 32バイト  |
| IBE-256  | 128ビット          | 32バイト  | 32バイト  |

#### 実用上の考慮事項

1. **鍵エスクロー**: PKGが全ての秘密鍵を知っている
2. **可用性**: PKGの障害が全システムに影響
3. **プライバシー**: 鍵生成時の通信が必要
4. **標準化**: IEEE P1363.3、ISO/IEC 18033-5

## 応用例

### 1. メール暗号化

```typescript
// メールアドレスを公開鍵として使用
const recipientID = "alice@company.com";
const encryptedEmail = ibe.encrypt(emailContent, recipientID);
```

### 2. クラウドストレージ

```typescript
// ファイル名をIDとして使用
const fileID = "documents/confidential.pdf";
const encryptedFile = ibe.encrypt(fileContent, fileID);
```

### 3. IoTデバイス

```typescript
// デバイスIDを公開鍵として使用
const deviceID = "sensor-001.iot.example.com";
const encryptedCommand = ibe.encrypt(command, deviceID);
```

## まとめ

IDベース暗号は、従来の公開鍵暗号の鍵管理の複雑さを解決する革新的な技術です。双線型ペアリング写像を数学的基盤とし、任意の文字列を公開鍵として使用できる特徴があります。

**主な利点**:
- 証明書が不要
- 鍵管理が簡素化
- 柔軟なID使用

**主な課題**:
- 鍵エスクロー問題
- ペアリング計算の重さ
- PKGの単一障害点

**今後の発展**:
- 分散化技術の研究
- 効率的なペアリング実装
- 新しい応用分野の開拓

IDベース暗号は、特にIoTやクラウドコンピューティングの分野で、鍵管理の簡素化に大きく貢献する可能性を秘めています。
