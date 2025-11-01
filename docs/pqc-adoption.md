# 耐量子暗号（PQC）の実世界での導入状況

**最終更新: 2025年10月**

本ドキュメントでは、耐量子暗号（Post-Quantum Cryptography, PQC）の実世界でのサービス、アプリケーション、ライブラリ、組織での導入事例および移行計画について、信頼できる情報源（URL）とともに整理しています。

---

## 目次

1. [日本企業・政府の動向](#1-日本企業政府の動向)
2. [海外主要企業の動向](#2-海外主要企業の動向)
3. [具体的なサービス・アプリケーション](#3-具体的なサービスアプリケーション)
4. [OSSライブラリ・実装](#4-ossライブラリ実装)
5. [標準化・移行計画](#5-標準化移行計画)
6. [2024-2025年の最新動向](#6-2024-2025年の最新動向)
7. [業界別導入状況](#7-業界別導入状況)

---

## 1. 日本企業・政府の動向

### 1.1 CRYPTREC

**動向**: 2025年3月に「CRYPTREC暗号技術ガイドライン（耐量子計算機暗号）2024年度版」を公開。暗号技術の初学者向けにPQCの必要性、標準化動向、移行の課題について解説。専門家向けには別途「研究動向調査報告書」も公開。2025年以降の標準アルゴリズムへの移行加速を見込んでいます。

**参考リンク**:
- [CRYPTREC 暗号技術ガイドライン（耐量子計算機暗号）](https://www.cryptrec.go.jp/topics/cryptrec-gl-3001-2024.html)（日本語）
- [耐量子計算機暗号の研究動向調査報告書](https://www.cryptrec.go.jp/reports/cryptrec-tr-3001-2024.html)（日本語）

### 1.2 総務省・経済産業省

**動向**: 2025年6月、内閣官房主導で「耐量子計算機暗号(PQC)利用に関する関係府省庁連絡会議」を設置。政府機関でのPQC利用を推進し、2025年度中には移行ロードマップの骨子を策定、次期サイバーセキュリティ戦略へ反映させる方針。

**参考リンク**:
- [耐量子計算機暗号(PQC)利用に関する関係府省庁連絡会議](https://www.cas.go.jp/jp/seisaku/pqc_renraku/index.html)（日本語）
- [総務省｜量子コンピューティング技術の研究開発](https://www.soumu.go.jp/main_sosiki/joho_tsusin/kenkyu/quantum/index.html)（日本語）

### 1.3 NTT

**動向**: IOWN構想の中核技術としてPQCを位置づけ、2024年10月には通信を止めずに暗号方式を切り替え可能な「耐量子セキュアトランスポートシステム」を開発。2030年頃の商用化を目指し、研究開発をリードしています。

**参考リンク**:
- [NTT、通信を止めずに暗号方式を切り替える耐量子セキュアトランスポートシステムを開発](https://group.ntt/jp/newsrelease/2024/10/30/241030a.html)（日本語）
- [NTT Develops Quantum-Resistant Secure Transport System](https://group.ntt/en/newsrelease/2024/10/30/241030a.html)（英語）

### 1.4 その他の日本企業

#### 富士通（Ridgelinez）

**動向**: グループ会社のRidgelinezが2025年10月より、暗号資産の棚卸しから移行計画策定までを支援する「PQC移行支援サービス」を提供開始。

**参考リンク**:
- [Ridgelinez、耐量子計算機暗号への移行支援サービスを提供開始](https://www.ridgelinez.com/news/2025/1001/)（日本語）

#### 日立ソリューションズ

**動向**: 2025年10月より、PQC移行に向けた現状分析、リスク評価、移行計画の策定を支援する「耐量子計算機暗号 移行支援コンサルティングサービス」を開始。

**参考リンク**:
- [日立ソリューションズ、耐量子計算機暗号への移行を支援するコンサルティングサービスを販売開始](https://www.hitachi-solutions.co.jp/company/press/news/2025/1002.html)（日本語）

#### NEC

**動向**: 大和証券のオンラインサービスを対象に、PQC技術の実用性を評価する共同実証実験を2025年9月から開始。

**参考リンク**:
- [NEC、大和証券と耐量子計算機暗号の共同実証を開始](https://jpn.nec.com/press/202509/20250925_01.html)（日本語）

### 1.5 日本の金融機関

**動向**: 金融庁が2024年11月に報告書を公表し、優先度の高いシステムについて2030年代半ばのPQC対応を推奨。これを受け、三菱UFJ、三井住友、みずほ等のメガバンクは、情報収集や計画策定を進めている段階。具体的な移行計画の公表はまだありませんが、業界全体で準備を進めています。

**参考リンク**:
- [金融庁「預金取扱金融機関の耐量子計算機暗号への対応に関する検討会」報告書](https://www.fsa.go.jp/news/r6/pqc/20241115/20241115.html)（日本語）

### 1.6 日本の通信事業者

#### NTTドコモ

**動向**: NTTグループとして、2025年1月にPQCを用いたスマートフォンでのセキュアなWeb会議の実証実験に成功。

**参考リンク**:
- [NTT Com、IOWN時代の新たなセキュア光トランスポート技術を開発](https://www.ntt.com/about-us/press-releases/news/article/2025/0116.html)（日本語）

#### KDDI

**動向**: 2024年6月、PQCの安全性評価に貢献する暗号解読コンテストで世界記録を達成。

**参考リンク**:
- [KDDI総合研究所、耐量子計算機暗号の安全性評価で世界記録を達成](https://www.kddi-research.jp/newsrelease/2024/0627.html)（日本語）

#### ソフトバンク

**動向**: 2025年5月、米SandboxAQとの共同実証実験の結果を公開。VPN等でのPQC早期商用化に期待を示しています。

**参考リンク**:
- [ソフトバンク、耐量子計算機暗号（PQC）の共同実証実験に関するホワイトペーパーを公開](https://www.softbank.jp/corp/news/press/sbkk/2025/20250515_01/)（日本語）

---

## 2. 海外主要企業の動向

### 2.1 Google

**動向**:
- **Chrome ブラウザ**: TLS 1.3でハイブリッド鍵交換（X25519 + Kyber-768）をデフォルト有効化
- **BoringSSL**: Kyber-768サポート

**参考リンク**:
- [Post-Quantum Cryptography is coming to Chrome](https://security.googleblog.com/2023/08/post-quantum-cryptography-is-coming-to.html)（英語）

### 2.2 Apple

**動向**: **iMessage PQ3** - 2024年2月発表、Kyberを使用した新プロトコル。商用メッセージングアプリとして最大規模のPQC展開。

**参考リンク**:
- [iMessage with PQ3](https://security.apple.com/blog/imessage-with-pq3/)（英語）

### 2.3 IBM

**動向**: **IBM Quantum Safe** - 企業向けPQC移行支援プログラム。CRYSTALS-Kyber, CRYSTALS-Dilithiumの開発元。

**参考リンク**:
- [IBM Quantum Safe](https://www.ibm.com/quantum/quantum-safe/)（英語）

### 2.4 Cloudflare

**動向**: TLS 1.3でのPQCサポート提供。顧客が自身のサイトでPQCを利用可能。

**参考リンク**:
- [The quantum threat and our path forward](https://blog.cloudflare.com/post-quantum-era)（英語）

### 2.5 Amazon (AWS)

**動向**: AWS KMS、AWS Certificate ManagerでPQCハイブリッド鍵交換サポート。

**参考リンク**:
- [Post-quantum cryptography in AWS KMS](https://aws.amazon.com/jp/blogs/security/post-quantum-cryptography-in-aws-kms/)（英語）

### 2.6 Microsoft

**動向**: **Quantum Safe Program** - 2033年までのPQC完全移行を目指す。2024年にはWindows 11のInsider Preview版でPQC機能のテスト提供を開始。Azure、Windows、Officeの暗号基盤である`SymCrypt`ライブラリに、NIST標準アルゴリズム（ML-KEM, ML-DSA）を統合中。

**参考リンク**:
- [Microsoft's journey toward a quantum-safe future](https://www.microsoft.com/en-us/security/blog/2024/06/12/progress-on-our-quantum-safe-journey/)（英語）
- [Taking the next steps toward a quantum-safe Windows](https://blogs.windows.com/windows-insider/2024/10/09/taking-the-next-steps-toward-a-quantum-safe-windows/)（英語）

### 2.7 Meta (Facebook)

**動向**: 2024年5月、PQCへの移行アプローチを公開。社内サービス間の通信（TLS）において、既存の暗号（X25519）とNIST選定アルゴリズム（Kyber）を組み合わせたハイブリッド暗号を実装。WhatsAppなど一般ユーザー向けサービスへの展開は今後の課題。

**参考リンク**:
- [Engineering for the future: How we're preparing for post-quantum cryptography](https://engineering.fb.com/2024/05/13/security/post-quantum-cryptography-pqc/)（英語）

### 2.8 Intel

**動向**: ソフトウェア（AVX-512命令）と専用ハードウェア（QAT, NetSec Accelerator Card）の両面からPQCの処理を高速化。最新のXeonプロセッサでPQCワークロードの性能向上をアピール。

**参考リンク**:
- [Intel Xeon 6 Processors Accelerate PQC Adoption](https://www.intel.com/content/www/us/en/newsroom/news/xeon-6-processors-accelerate-pqc-adoption.html)（英語）

### 2.9 グローバル金融機関

#### JPMorgan Chase

**動向**: PQCとQKD（量子鍵配送）を組み合わせた戦略を推進。2024年には、データセンター間でQKDを活用したネットワークを本番環境レベルで実装。

**参考リンク**:
- [J.P. Morgan Announces Quantum-Secured Crypto-Agile Network](https://www.jpmorgan.com/news/j-p-morgan-announces-quantum-secured-crypto-agile-network)（英語）

#### 業界動向

**動向**: 金融サービス情報共有分析センター（FS-ISAC）が業界全体のPQC移行タイムライン策定を主導。

### 2.10 グローバル通信事業者

#### Vodafone

**動向**: IBMやSandboxAQと提携し、PQC技術の実証実験を積極的に実施。2025年のMWC（Mobile World Congress）では、スマートフォンを保護するPQCのデモを展示。

#### AT&T

**動向**: 2025年までに「Quantum Ready（量子対応準備完了）」となることを目標に掲げ、社内の暗号資産の棚卸しと移行計画の策定を進行中。

#### Verizon

**動向**: 2025年9月、既存の商用光ファイバー網上で量子信号を伝送する実験に成功。量子セキュアなエコシステム全体の構築に貢献。

---

## 3. 具体的なサービス・アプリケーション

### 3.1 メッセージングアプリ

#### Signal

**動向**: **PQXDH プロトコル** - 2023年導入、Kyber使用。X3DHプロトコルをPQC対応させた実装。

**参考リンク**:
- [PQXDH: Post-Quantum Extended Diffie-Hellman](https://signal.org/blog/pqxdh/)（英語）

#### Apple iMessage

**動向**: **PQ3 プロトコル** - 商用最大規模のPQC展開。初期鍵確立にKyberを使用し、継続的なメッセージ交換でもPQC保護を維持。

**参考リンク**:
- [iMessage with PQ3](https://security.apple.com/blog/imessage-with-pq3/)（英語）

### 3.2 ブラウザ

#### Google Chrome

**動向**: Kyber-768デフォルト有効化。TLS 1.3の鍵交換において、ハイブリッド方式（X25519 + Kyber-768）を使用。

**参考リンク**:
- [Post-Quantum Cryptography is coming to Chrome](https://security.googleblog.com/2023/08/post-quantum-cryptography-is-coming-to.html)（英語）

#### その他ブラウザ

**動向**: Firefox, Safari, Edge - 標準化完了後に追随予定。

### 3.3 VPN・通信サービス

#### Mullvad VPN, Proton VPN

**動向**: liboqsを利用した実験的PQCサポート。

---

## 4. OSSライブラリ・実装

### 4.1 liboqs (Open Quantum Safe)

**概要**: PQCアルゴリズムの研究・プロトタイピングのための主要なオープンソースライブラリ。NISTの最終候補を含む多くのアルゴリズムを統一されたAPIで提供。

**参考リンク**:
- GitHub: [https://github.com/open-quantum-safe/liboqs](https://github.com/open-quantum-safe/liboqs)
- 公式サイト: [https://openquantumsafe.org/](https://openquantumsafe.org/)

### 4.2 BoringSSL

**概要**: GoogleのOpenSSLフォーク。Kyber-768実装済み。Chromeで使用中。

**対応アルゴリズム**: Kyber-768

### 4.3 OpenSSL

**概要**: バージョン3.2以降で実験的PQCサポート。OQSプロジェクトが提供するプロバイダ（`oqsprovider`）を介して、OpenSSL 3.xでPQCアルゴリズムを利用可能。

**参考リンク**:
- 公式サイト: [https://www.openssl.org/](https://www.openssl.org/)
- OQS Provider: [https://github.com/open-quantum-safe/oqsprovider](https://github.com/open-quantum-safe/oqsprovider)

### 4.4 rustls

**概要**: 2024年、実験的なクレート `rustls-post-quantum` を通じて、Kyberを利用したハイブリッド鍵交換のサポートを開始。安定化後、本体の `rustls` クレートに統合予定。

**参考リンク**:
- [Bringing Post-Quantum Cryptography to Rustls](https://memorysafety.org/blog/rustls-pqc/)（英語）

### 4.5 WolfSSL

**概要**: 軽量な組み込み向けライブラリ。NIST標準アルゴリズム（ML-KEM, ML-DSA）の自社実装を完了し、TLS 1.3等に統合済み。2025年には各種認証の取得を目指し、特にIoT分野での採用をリード。

**参考リンク**:
- [wolfSSL Post-Quantum Cryptography](https://www.wolfssl.com/products/pqc/)（英語）
- [wolfSSL PQC対応](https://www.wolfssl.jp/main/pqc_2.html)（日本語）

---

## 5. 標準化・移行計画

### 5.1 NIST標準化

#### 標準化アルゴリズム（2022年発表）

- **公開鍵暗号化/KEM**: CRYSTALS-Kyber
- **デジタル署名**: CRYSTALS-Dilithium, Falcon, SPHINCS+

#### FIPS標準（2024年8月13日正式発行）

- **FIPS 203**: `ML-KEM` (CRYSTALS-Kyber) - 鍵カプセル化メカニズム
- **FIPS 204**: `ML-DSA` (CRYSTALS-Dilithium) - デジタル署名
- **FIPS 205**: `SLH-DSA` (SPHINCS+) - デジタル署名

**参考リンク**:
- [NIST Posts First Three Post-Quantum Cryptography Standards](https://www.nist.gov/news-events/news/2024/08/nist-posts-first-three-post-quantum-cryptography-standards)（英語）
- [NIST Post-Quantum Cryptography Project](https://csrc.nist.gov/Projects/post-quantum-cryptography)（英語）

#### 新たな標準化ラウンド

**動向**: 追加のアルゴリズム選定を進行中。第4ラウンドでは、鍵カプセル化メカニズムとして**HQC**が選定。さらに、多様なデジタル署名アルゴリズムを確保するため、新たな公募プロセス（"on-ramp"）も進行中。

**参考リンク**:
- [NIST Announces Additional Post-Quantum Standardization Plans](https://www.nist.gov/news-events/news/2024/06/nist-announces-additional-post-quantum-standardization-plans)（英語）

### 5.2 米国政府の移行計画

#### CISA（サイバーセキュリティ・インフラストラクチャセキュリティ庁）

**動向**: 遅くとも2035年までにほとんどのシステムをPQCへ移行するよう要求。

**参考リンク**:
- [CISA - Post-Quantum Cryptography Initiative](https://www.cisa.gov/pqc)（英語）

#### NSM-10（National Security Memorandum）

**動向**: 2024年7月にホワイトハウスが発行。連邦政府機関の暗号資産の棚卸しと移行計画策定を本格化。

**参考リンク**:
- [Memorandum on Migrating to Post-Quantum Cryptography (NSM-10)](https://www.whitehouse.gov/briefing-room/statements-releases/2022/05/04/national-security-memorandum-on-promoting-united-states-leadership-in-quantum-computing-while-mitigating-risks-to-vulnerable-cryptographic-systems/)（英語）

### 5.3 移行戦略

#### ハイブリッド方式 (Hybrid Approach)

**概要**: 多くの初期導入事例では、実績のある古典的暗号（例: X25519）と新しいPQC（例: Kyber）を組み合わせ。PQCアルゴリズムに未知の脆弱性があった場合でも、古典暗号の安全性が保たれる。

#### 暗号アジリティ (Crypto-Agility)

**概要**: 将来、暗号アルゴリズムを容易に切り替えられるようにシステムを設計することが強く推奨される。

---

## 6. 2024-2025年の最新動向

### 6.1 NIST FIPS標準の正式化

**状況**: 2024年8月13日に正式発行完了（FIPS 203, 204, 205）。政府調達・規制産業での本格導入が開始。

### 6.2 大規模導入事例

#### 金融: Banco Sabadell（スペイン）

**動向**: 2024年後半、QuSecure社等と共同でPQC移行のパイロットプロジェクトを完了。金融業界における重要な先行事例。

**参考リンク**:
- [QuSecure and Accenture Complete Post-Quantum Cryptography Pilot with Banco Sabadell](https://www.thequantuminsider.com/2024/11/20/qusecure-and-accenture-complete-post-quantum-cryptography-pilot-with-banco-sabadell/)（英語）

### 6.3 セキュリティインシデント

#### KyberSlash攻撃

**動向**: 2023年後半から2024年初頭にかけて、NIST標準の`CRYSTALS-Kyber`の複数の実装に対してサイドチャネル攻撃が発見。アルゴリズム自体の数学的な欠陥ではなく、実装における処理時間の差異を悪用。脆弱性が発見されたライブラリには既に修正パッチが提供済み。この一件は、PQCアルゴリズムを製品に組み込む際の、慎重な実装と継続的な監査の重要性を示す。

**参考リンク**:
- [KyberSlash attacks threaten post-quantum encryption standard](https://www.bleepingcomputer.com/news/security/kyberslash-attacks-threaten-post-quantum-encryption-standard/)（英語）

### 6.4 量子コンピュータの進展

**動向**: IBM、Google、IonQといった主要プレイヤーは、2024年から2025年にかけて物理量子ビット数の増加やエラー訂正技術で大きな進歩を遂げています。しかし、現在の暗号を解読するために必要とされる数千〜数百万の**論理**量子ビットの実現には、まだ大きな技術的ハードルが残存。現在の進展は「Harvest Now, Decrypt Later（今はデータを収集し、未来の量子コンピュータで解読する）」攻撃の現実味を増しており、PQCへの早期移行の必要性を裏付け。

**参考リンク**:
- [IonQ Accelerates Quantum Computing Roadmap, Projecting Path to 1,600 Logical Qubits by 2028](https://ionq.com/news/ionq-accelerates-quantum-computing-roadmap)（英語）
- [Google Quantum AI's 2025 breakthroughs and what's next](https://blog.google/technology/quantum-ai/google-quantum-ai-2025-milestones-whats-next/)（英語）

### 6.5 実装の進捗

**状況**:
- **ソフトウェア先行**: ブラウザ、メッセージングアプリでの導入が先行
- **今後の展開**: ハードウェア（TPM, HSM）、OS、エンタープライズ製品への拡大
- **フェーズ移行**: アルゴリズム選定 → 安全な実装・移行へ

---

## 7. 業界別導入状況

### 7.1 医療

**動向**: 医療機器はライフサイクルが10年を超えるものが多く、将来の解読リスクに備えるためPQCの必要性が叫ばれています。FDA（米国食品医薬品局）のサイバーセキュリティガイダンスもメーカーに対応を促していますが、低電力な医療機器でのパフォーマンスが課題。

**参考リンク**:
- [The Quantum Countdown: Is Medtech Ready for a Post-Quantum World?](https://www.medcrypt.com/news/the-quantum-countdown-is-medtech-ready-for-a-post-quantum-world)（英語）

### 7.2 IoT

**動向**: デバイスの性能やメモリの制約がPQC導入の大きな障壁。軽量なPQCアルゴリズムの開発と標準化が急がれています。スマートメーターや産業用IoTなど、高価値なデバイスから段階的な導入が進むと見られています。

**参考リンク**:
- [Post-Quantum Cryptography (PQC) for IoT](https://www.isaca.org/resources/news-and-trends/isaca-now-blog/2024/post-quantum-cryptography-pqc-for-iot)（英語）

### 7.3 ブロックチェーン

**動向**: 量子コンピュータは、現在のブロックチェーンの基盤である公開鍵暗号を根本から覆す可能性があり、業界にとって存亡に関わる脅威。Ethereum財団などがPQCへの移行を研究しており、PQCを当初から実装した新しいブロックチェーンプロジェクトも複数登場。

**参考リンク**:
- [The Quantum Resistant Ledger (QRL)](https://www.theqrl.org/)（英語）

### 7.4 自動車

**動向**: V2X（車車間・路車間通信）やOTA（Over-The-Air）アップデートのセキュリティ確保が喫緊の課題。自動車の開発・製品ライフサイクルは長いため、2024-2025年現在、将来の安全基準を満たすためのPQC採用が検討され始めています。

**参考リンク**:
- [Post-Quantum Cryptography (PQC) in the Automotive Industry](https://www.autocrypt.io/pqc-in-the-automotive-industry/)（英語）

---

## 参考資料

### 主要な情報源

- [NIST Post-Quantum Cryptography Project](https://csrc.nist.gov/Projects/post-quantum-cryptography)
- [CRYPTREC（暗号技術検討会）](https://www.cryptrec.go.jp/)
- [Open Quantum Safe Project](https://openquantumsafe.org/)
- [CISA - Post-Quantum Cryptography Initiative](https://www.cisa.gov/pqc)

### 関連ドキュメント

- [高機能暗号のOSSライブラリ](./oss-libraries.md) - 属性ベース暗号、検索可能暗号、グループ署名などのライブラリ情報
- [articles/第7回/article.md](../articles/第7回/article.md) - 耐量子暗号の理論と標準化について

---

**注**: 本ドキュメントは2025年10月時点の情報に基づいています。PQCの分野は急速に発展しているため、最新情報については各参考リンク先の公式情報をご確認ください。
