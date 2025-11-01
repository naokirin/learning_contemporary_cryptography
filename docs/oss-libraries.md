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
| **bbs-signatures** | Rust, JS(WASM) | [mattrglobal/bbs-signatures](https://github.com/mattrglobal/bbs-signatures) | BBS+署名のRust実装。WASMを介してJS/TSからも利用可能。VC (Verifiable Credentials) での利用を想定。 | アクティブ |
| **bbs-signature-go** | Go | [trustbloc/bbs-signature-go](https://github.com/trustbloc/bbs-signature-go) | Hyperledger Ariesの一部として開発されたBBS+署名のGo実装。 | アクティブ |
| **AMCL** | C, Go, Rust, etc. | [miracl/amcl](https://github.com/miracl/amcl) | Apache Milagro Crypto Library。BBS+を含むグループ署名の古典的な実装も含む。 | メンテナンス中 |

### 研究用ライブラリ（実用に近い）

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **py_bbs_plus** | Python | [TNO/py_bbs_plus](https://github.com/TNO/py_bbs_plus) | BBS+署名のPython実装。内部でRustの`bbs-signatures`ライブラリをFFI経由で呼び出している。 | メンテナンス中 |

## 5. リング署名 (Ring Signature)

リング署名は、署名者を特定できない匿名署名技術です。暗号資産Moneroなどで実用化されており、比較的ライブラリが見つかりやすいです。

### プロダクション利用可能なライブラリ

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **nazgul** | Rust | [Clovyr/nazgul](https://github.com/Clovyr/nazgul) | Moneroで使われているMLSAGやCLSAGを含む複数のリング署名スキームを実装。Ristretto曲線を使用。 | メンテナンス中 |
| **ring-crypto** | JS(WASM) | [cryptonote-web/ring-crypto](https://github.com/cryptonote-web/ring-crypto) | Moneroの暗号ライブラリをWebAssemblyにコンパイルしたもの。JavaScriptでリング署名を扱う際の有力候補。 | メンテナンス中 |

### 研究・教育用ライブラリ

| ライブラリ名 | 言語 | GitHubリポジトリ | 特徴・使いやすさ | 開発状況 |
|:------------|:-----|:----------------|:----------------|:---------|
| **pyring** | Python | [sedrubal/pyring](https://github.com/sedrubal/pyring) | CryptoNoteの論文に基づいたワンタイムリング署名のPython実装。libsodiumを利用。 | 活動停止 |
| **go-ring** | Go | [shaih/go-ring](https://github.com/shaih/go-ring) | リング署名のシンプルなGo実装。教育目的や基本的な動作の理解に適している。 | 活動停止 |

## TypeScript/JavaScriptでの利用について

TypeScript/JavaScriptでこれらの高機能暗号を利用する場合、以下のアプローチがあります：

### 1. WebAssembly (WASM) 経由でRustライブラリを利用

最も推奨される方法です。Rustで実装された高性能なライブラリをWASMにコンパイルして利用します。

- **MIRACL Core**: ペアリング暗号のC/C++実装をWASMで利用
- **bbs-signatures**: BBS+署名のRust実装をWASMで利用
- **ring-crypto**: Moneroのリング署名をWASMで利用

### 2. ネイティブバインディング経由でC/C++/Rustライブラリを利用

Node.jsのネイティブアドオンを使用する方法です。パフォーマンスは高いですが、クロスプラットフォーム対応が複雑になります。

### 3. 純粋なTypeScript/JavaScript実装

現時点では、高機能暗号の純粋なTypeScript/JavaScript実装は限定的です。教育目的であれば自作も可能ですが、プロダクション利用には推奨されません。

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
- arkworks, pairing, rabe, nazgul, bbs-signaturesなど
- WebAssembly経由でJavaScript/TypeScriptからも利用可能

### Go
- CloudflareやHyperledgerなどの企業・プロジェクトによる実用的なライブラリが存在
- circl, Kyber, gofe, bbs-signature-goなど
- サーバーサイドでの利用に適している

### Python
- Ethereum (py_ecc) などの例外を除き、多くは研究・プロトタイピング用途
- Charm-Crypto, Charm-based ABE, py_bbs_plusなど
- 教育目的や概念実証に適している

### TypeScript/JavaScript
- 直接実装は少なく、RustやC++で書かれたコアライブラリをWebAssembly経由で利用する形が主流
- MIRACL Core, bbs-signatures, ring-cryptoなど
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
