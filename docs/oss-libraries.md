# 高機能暗号のOSSライブラリ一覧

このドキュメントは、[第6回の記事](../articles/第6回/article.md)で取り上げている高機能暗号技術について、実際に動かせるOSSライブラリやツールの調査結果をまとめたものです。

## 概要

高機能暗号（Advanced Cryptography）は、従来の暗号技術では実現できなかった高度な機能を提供します。本ドキュメントでは、以下の技術について利用可能なOSSライブラリを紹介します：

1. 双線型ペアリング (Bilinear Pairing)
2. 属性ベース暗号 (ABE: Attribute-Based Encryption)
3. 検索可能暗号 (Searchable Encryption)
4. グループ署名 (Group Signature)
5. リング署名 (Ring Signature)

## 1. 双線型ペアリング (Bilinear Pairing)

双線型ペアリングは、多くの高機能暗号の基礎となる数学的演算です。近年はBLS12-381曲線が標準的に利用されています。

### プロダクション利用可能なライブラリ

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **arkworks** | Rust | [arkworks-project/curves](https://github.com/arkworks-project/curves) | 包括的なゼロ知識証明ライブラリ群の一部。BLS12-381など複数のペアリング曲線に対応。パフォーマンスと安全性を重視。 | アクティブ |
| **pairing** | Rust | [zkcrypto/pairing](https://github.com/zkcrypto/pairing) | ペアリング暗号の基本的なトレイトを定義するRustのコアライブラリ。多くのエコシステムで利用されている。 | アクティブ |
| **Kyber** | Go | [dedis/kyber](https://github.com/dedis/kyber) | スイスの大学EPFL発の暗号ライブラリ。`pairing/bn256`でBN256曲線上のペアリングをサポート。 | アクティブ |
| **py_ecc** | Python | [ethereum/py_ecc](https://github.com/ethereum/py_ecc) | Ethereumのコンセンサスレイヤーで使用。BLS12-381を含む複数のペアリング曲線に対応。実戦でテスト済み。 | アクティブ |
| **MIRACL Core** | C/C++, JS(WASM) | [miracl/core](https://github.com/miracl/core) | 高速な暗号ライブラリ。多くのペアリング曲線に対応し、WebAssemblyにコンパイルしてJavaScriptからも利用可能。 | アクティブ |

### 研究・教育用ライブラリ

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **Charm-Crypto** | Python | [JHUISI/charm](https://github.com/JHUISI/charm) | 高機能暗号のラピッドプロトタイピング用フレームワーク。多くのペアリングベース暗号を実装。学習用途に最適。 | メンテナーを探している |

## 2. 属性ベース暗号 (ABE: Attribute-Based Encryption)

属性ベース暗号は、きめ細かいアクセス制御を暗号化レベルで実現します。CP-ABE（暗号文ポリシー）の方が、データ作成者がアクセス制御を行えるため、より実用的と考えられています。

### プロダクション利用可能なライブラリ

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **circl** | Go | [cloudflare/circl](https://github.com/cloudflare/circl) | Cloudflareによる高性能暗号ライブラリ。`abe/cpabe` パッケージでCP-ABEを実装。 | アクティブ |

### 研究用ライブラリ（実用に近い）

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **rabe** | Rust | [zeng-go/rabe](https://github.com/zenGo-X/rabe) | CP-ABE (BSW) と KP-ABE (AC17) の両方を実装。APIが整理されており、Rust製ABEライブラリの第一候補。 | メンテナンス中 |
| **gofe** | Go | [fentec-project/gofe](https://github.com/fentec-project/gofe) | FAME (CP-ABE) と GPSW (KP-ABE) を実装した関数型暗号ライブラリ。GoでABEを試す際の有力候補。 | メンテナンス中 |
| **OpenABE** | C++ | [idemix/OpenABE](https://github.com/idemix/OpenABE) | C++で書かれたABEライブラリ。複数のABEスキームをサポート。 | メンテナンス中 |

### 研究・教育用ライブラリ

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **Charm-based ABE** | Python | [sagrawal87/Charm-based-ABE](https://github.com/sagrawal87/Charm-based-ABE) | Charm-Cryptoフレームワーク上で複数のCP-ABEスキームを実装。学術的な実装の理解に役立つ。 | 活動停止 |

## 3. 検索可能暗号 (Searchable Encryption)

検索可能暗号は、暗号化されたデータに対して復号化せずに検索を行う技術です。実用的なライブラリはまだ少なく、多くは研究段階です。

### プロダクション利用可能なライブラリ

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **Acra** | Go, Python, Ruby | [cossacklabs/acra](https://github.com/cossacklabs/acra) | データベースセキュリティスイート。SQL/NoSQL対応の透過的な暗号化と検索可能暗号化機能を提供。実用性が高い。 | アクティブ |

### 研究・教育用ライブラリ

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **Clusion** | Java | [encryptedsystems/Clusion](https://github.com/encryptedsystems/Clusion) | ブラウン大学によるSSEライブラリ。複数のSSEスキーム（Boolean検索など）を実装。 | 活動停止 |
| **go-sse** | Go | [d1str0/sse](https://github.com/d1str0/sse) | 論文 "Dynamic Searchable Encryption in Very-Large Databases" に基づくSSEの実装。 | 活動停止 |
| **SEEK** | C++ | [eecs-utarlington/seek](https://github.com/eecs-utarlington/seek) | 複数のSSEスキームの性能を比較・評価するためのフレームワーク。 | メンテナンス中 |

## 4. グループ署名 (Group Signature)

グループ署名は、グループメンバーがグループ全体として署名を行う技術です。近年は、選択的開示などの機能を持つ **BBS+署名** が標準化されつつあり、これがグループ署名の一種として利用されています。

### プロダクション利用可能なライブラリ

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **bbs-signatures** | Rust, JS(WASM) | [mattrglobal/bbs-signatures](https://github.com/mattrglobal/bbs-signatures) | BBS+署名のRust実装。WASMを介してJS/TSからも利用可能。VC (Verifiable Credentials) での利用を想定。263+ stars。 | アクティブ（2024年8月更新） |
| **bbs-signature-go** | Go | [trustbloc/bbs-signature-go](https://github.com/trustbloc/bbs-signature-go) | Hyperledger Ariesの一部として開発されたBBS+署名のGo実装。100+ stars。 | アクティブ（2024年10月更新） |
| **@docknetwork/crypto-wasm** | TypeScript/WASM | [docknetwork/crypto-wasm](https://github.com/docknetwork/crypto-wasm) | Dock's Rust暗号ライブラリのWASMラッパー。BBS+署名、BLS12-381曲線をサポート。 | アクティブ |
| **@herculas/bbs-signature** | TypeScript/WASM | [JSR Package](https://jsr.io/@herculas/bbs-signature) | RustからWASMにコンパイルされたBBS+実装。BBS Signature Scheme v8準拠。 | アクティブ |

### 研究用ライブラリ（実用に近い）

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **py_bbs_plus** | Python | [TNO/py_bbs_plus](https://github.com/TNO/py_bbs_plus) | BBS+署名のPython実装。内部でRustの`bbs-signatures`ライブラリをFFI経由で呼び出している。30+ stars。 | 低（2023年1月以降更新なし） |

### 非推奨・アーカイブ済み

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **@mattrglobal/bbs-signatures (npm)** | TypeScript/WASM | [mattrglobal/node-bbs-signatures](https://github.com/mattrglobal/node-bbs-signatures) | 非推奨。新しいPairing Cryptography libraryへの移行が推奨される。 | 非推奨 |
| **miracl/amcl** | C, Go, Rust, etc. | [miracl/amcl](https://github.com/miracl/amcl) | Apache Milagro Crypto Library（アーカイブ済み）。`miracl/core`への移行が推奨。ペアリング暗号の基礎部品のみ提供。 | アーカイブ済み（2020年10月） |

## 5. リング署名 (Ring Signature)

リング署名は、署名者を特定できない匿名署名技術です。暗号資産Moneroなどで実用化されており、CLSAG（Compact Linkable Spontaneous Anonymous Group）やMLSAGといった方式が実装されています。

### プロダクション利用可能なライブラリ

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **monero** | C++ | [monero-project/monero](https://github.com/monero-project/monero) | Monero公式実装。CLSAG, MLSAGを含む最も信頼性の高いリング署名実装。5.1k+ stars。 | 非常に高（数時間〜1日以内に更新） |

### アクティブな研究・実装用ライブラリ（2024年更新あり）

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **nazgul** | Rust | [edwinhere/nazgul](https://github.com/edwinhere/nazgul) | SAG, bLSAG, MLSAG, CLSAG を実装。Zero to Monero 2.0のChapter 3に基づく。Ristretto曲線使用。 | アクティブ |
| **MLSAG** | Rust | [crate-crypto/MLSAG](https://github.com/crate-crypto/MLSAG) | MLSAG実装（CLSAGの基礎）。105 stars。監査未実施のため利用は自己責任。 | 中（2024年5月更新） |
| **CLSAG-Python** | Python | [Kryptogarten/CLSAG-Python](https://github.com/Kryptogarten/CLSAG-Python) | MoneroのCLSAGのPython実装。20 stars。教育・プロトタイプ目的。 | 中（2024年7月更新） |
| **fujisaki-ringsig** | Rust | [rozbb/fujisaki-ringsig](https://github.com/rozbb/fujisaki-ringsig) | Fujisaki-Suzuki Traceable Ring Signature実装。curve25519-daleクライブラリ使用。 | アクティブ |
| **ring-signatures-rs** | Rust | [arnaucube/ring-signatures-rs](https://github.com/arnaucube/ring-signatures-rs) | bLSAG（Back's Linkable SAG）のRust実装。arkworks使用。学習目的。 | アクティブ |

### メンテナンス停止だが比較的新しいライブラリ

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **ring-go** | Go | [noot/ring-go](https://github.com/noot/ring-go) | MLSAG実装。55 stars。 | 低（2023年11月以降更新なし） |
| **ring-crypto** | JS(WASM) | [survirtual/ring-crypto](https://github.com/survirtual/ring-crypto) | Monero暗号ライブラリのWASM版。59 stars。npm: `ring-crypto` | 低（2020年10月以降更新なし） |

### 404エラー・存在しないリポジトリ

以下のリポジトリは存在しないか、削除されています：
- ❌ **Clovyr/nazgul** - リポジトリが存在しない（edwinhere/nazgulが正しい）
- ❌ **sedrubal/pyring** - リポジトリが存在しない
- ❌ **shaih/go-ring** - これはConsistent Hashingライブラリでリング署名ではない

## TypeScript/JavaScriptでの利用について

TypeScript/JavaScriptでこれらの高機能暗号を利用する場合、以下のアプローチがあります：

### 1. WebAssembly (WASM) 経由でRustライブラリを利用（推奨）

最も推奨される方法です。Rustで実装された高性能なライブラリをWASMにコンパイルして利用します。

**グループ署名（BBS+）:**
- **@docknetwork/crypto-wasm**: Dock's Rust暗号ライブラリのWASMラッパー。BBS+署名、BLS12-381をサポート
- **@herculas/bbs-signature**: BBS Signature Scheme v8準拠。JSRパッケージ
- **mattrglobal/bbs-signatures**: BBS+署名のRust実装のWASM版

**リング署名:**
- **ring-crypto** (npm): Moneroの暗号ライブラリのWASM版（2020年以降更新停止だが利用可能）

**ペアリング暗号:**
- **MIRACL Core**: ペアリング暗号のC/C++実装をWASMで利用可能

### 2. ネイティブバインディング経由でC/C++/Rustライブラリを利用

Node.jsのネイティブアドオンを使用する方法です。パフォーマンスは高いですが、クロスプラットフォーム対応が複雑になります。

- **crypto-wasm-ts**: Docknetworkの TypeScript抽象化レイヤー

### 3. 純粋なTypeScript/JavaScript実装

現時点では、高機能暗号の純粋なTypeScript/JavaScript実装は非常に限定的です。教育目的であれば自作も可能ですが、プロダクション利用には推奨されません。

## 実用性レベルの分類

調査結果から、各技術の実用性レベルは以下のように分類できます：

### プロダクション利用可能（商用利用に耐えうる）

- **双線型ペアリング**: 多数のライブラリが存在し、暗号資産やゼロ知識証明で実用化
- **リング署名**: Moneroなどで実用化済み
- **グループ署名（BBS+）**: Verifiable Credentialsなどで実用化が進行中

### 研究段階（実用に近いが慎重な評価が必要）

- **属性ベース暗号（ABE）**: Cloudflareのcirclなど実用を目指したライブラリも存在
- **検索可能暗号**: Acraのような特定製品に組み込まれた形での実用化が進行中

## 言語別の傾向

### Rust
- パフォーマンスと安全性を重視したプロダクションレベルのライブラリが最も多い
- **ペアリング**: arkworks, pairing
- **ABE**: rabe
- **グループ署名**: bbs-signatures
- **リング署名**: nazgul, MLSAG, fujisaki-ringsig, ring-signatures-rs
- WebAssembly経由でJavaScript/TypeScriptからも利用可能

### Go
- CloudflareやHyperledgerなどの企業・プロジェクトによる実用的なライブラリが存在
- **ペアリング**: Kyber
- **ABE**: circl (Cloudflare), gofe
- **グループ署名**: bbs-signature-go (Hyperledger)
- **リング署名**: ring-go（メンテナンス停止）
- サーバーサイドでの利用に適している

### Python
- Ethereum (py_ecc) などの例外を除き、多くは研究・プロトタイピング用途
- **ペアリング**: py_ecc (Ethereum)
- **ABE**: Charm-Crypto, Charm-based ABE
- **グループ署名**: py_bbs_plus
- **リング署名**: CLSAG-Python
- 教育目的や概念実証に適している

### C++
- Moneroなど実績のある暗号資産プロジェクトで採用
- **リング署名**: monero-project/monero（最も信頼性が高い）
- 高いパフォーマンスが求められる場合に適している

### TypeScript/JavaScript
- 直接実装は少なく、RustやC++で書かれたコアライブラリをWebAssembly経由で利用する形が主流
- **ペアリング**: MIRACL Core (WASM)
- **グループ署名**: @docknetwork/crypto-wasm, @herculas/bbs-signature, bbs-signatures (WASM)
- **リング署名**: ring-crypto (WASM、メンテナンス停止）
- フロントエンド・ブラウザでの利用に適している

## セキュリティに関する注意事項

これらの高機能暗号技術をアプリケーションに組み込む際は、以下の点に注意が必要です：

1. **暗号方式の安全性仮定の理解**
   - 各暗号方式が依拠する数学的仮定（例：双線型Diffie-Hellman仮定）を理解する
   - 許容可能な情報漏洩（例：検索可能暗号における検索パターンの漏洩）を把握する

2. **実装の成熟度の評価**
   - ライブラリの開発状況（アクティブか、メンテナンス中か、活動停止か）を確認
   - セキュリティ監査の有無を確認
   - 実績のある暗号資産プロジェクトなどでの採用実績を確認

3. **パフォーマンスのトレードオフ**
   - 高機能暗号は従来の暗号に比べて計算コストが高い場合が多い
   - 実際のユースケースでのパフォーマンステストを実施

4. **専門家によるレビュー**
   - 可能であれば、暗号の専門家によるレビューを受けることを推奨
   - 特にプロダクション環境での利用前には必須

## 参考資料

- [第6回の記事: 高機能暗号 - 未来の暗号技術](../articles/第6回/article.md)
- [ゼロ知識証明とプライバシー保護技術の展望](../articles/第7回/article.md)

## 更新履歴

- 2025-11-01: 初版作成（Gemini MCP調査に基づく）
- 2025-11-01: グループ署名・リング署名のライブラリ情報を再調査・更新
  - 404エラーのリポジトリを削除（Clovyr/nazgul, sedrubal/pyring等）
  - 新規ライブラリを追加（edwinhere/nazgul, @docknetwork/crypto-wasm, @herculas/bbs-signature等）
  - 各ライブラリの最終更新日、スター数を追加
  - MIRACL AMCLの記述を修正（ペアリング暗号の基礎部品のみ提供、BBS+/グループ署名の完成実装は含まず）
  - TypeScript/JavaScriptでの利用可能なライブラリを明確化
