# ヴァーナム暗号（バーナム暗号）/ ワンタイムパッド（One-Time Pad, OTP）

## 概要
- **定義**: 平文ビット列と同長の真にランダムな鍵ビット列を XOR する方式。復号も XOR。
- **本質**: 鍵が一様独立・一回限り・平文と同長であれば、理論的な完全秘匿（Perfect Secrecy）を達成する。
- **実務上の位置づけ**: 鍵配布・保管コストが極めて高く大規模運用に不向き。歴史的・特殊用途（例: ホットライン、オフライン手渡しなど）でのみ現実的。

## アルゴリズム（鍵生成・暗号化・復号）
- 鍵生成 \( \mathrm{KeyGen}(1^{\lambda}, \lvert m \rvert) \rightarrow k \)
  - 平文長 \(L = \lvert m \rvert\) と同じ長さの鍵 \(k \in \{0,1\}^L\) を、暗号学的に真にランダム（理想的には物理乱数）に生成。
- 暗号化 \( \mathrm{Enc}(m, k) = c \)
  - \( c = m \oplus k \)
- 復号化 \( \mathrm{Dec}(c, k) = m \)
  - \( m = c \oplus k \)

## 完全秘匿（Perfect Secrecy）の条件と直観
- 条件
  - **鍵の一様性**: \(k\) は一様分布。
  - **独立性**: \(k\) は \(m\) と独立。
  - **同長性**: \( \lvert k \rvert = \lvert m \rvert \)。
  - **一回限りの使用**: 同一鍵の再利用禁止（One-Time）。
- 直観（スケッチ）
  - 任意の \(m, c\) について \(\Pr[C=c\mid M=m] = \Pr[K=c\oplus m] = 2^{-L}\)。
  - 暗号文分布が平文に依存しないため、攻撃者は平文を識別できない（Shannon の完全秘匿）。

## 誤用時の脅威（Two-Time Pad など）
- **鍵再利用**（致命的）
  - 2つの暗号文 \(c_1 = m_1\oplus k\), \(c_2 = m_2\oplus k\) を XOR すると \(c_1\oplus c_2 = m_1\oplus m_2\)。
  - 既知平文/推測により他方を回収できる（頻度・辞書・構造利用）。
- **鍵が非一様/擬似乱数**
  - 統計的偏りや内部状態漏れが生じれば完全秘匿は崩壊。OTP は「真の乱数」を前提。
- **完全性なし**
  - OTP は改ざん検知を提供しない。暗号文のビット反転で任意ビットを反転可能。実運用では別途 MAC が必要（ただし OTP の理論的前提は「機密性のみ」を扱う点に注意）。

## 実務の要点（なぜ一般利用されないか）
- **鍵配送と保管**: \(\lvert k \rvert = \lvert m \rvert\) で大量データほど鍵も巨大。安全な配送・保管・破棄が最難関。
- **使い回し禁止**: 運用ヒューマンエラーで再利用が起きやすく、影響は壊滅的。
- **同期管理**: どのビット/ブロックまで消費したかの正確な状態管理が必須。
- **結論**: 一般用途では AEAD（例: AES-GCM, ChaCha20-Poly1305）を推奨。OTP は限定的・特殊要件下のみ検討。

## 参考となる運用指針
- 大容量・オンライン通信: 鍵管理容易な **認証付き暗号（AEAD）** を用いる。
- オフライン・短文・特別高機密: 物理媒体で鍵を安全に事前共有できる場合に限り OTP を検討。
- 改ざん耐性: OTP を使うなら独立鍵の **MAC**（例: HMAC-SHA-256）で完全性付与。ただし鍵処理は厳重に分離。

## 最低限のチェックリスト
- 鍵は真にランダムか（偏り・生成器の信頼性）
- 平文と同長か、完全に一度限りの消費か
- 鍵配送・保管・破棄の物理/組織的安全性は十分か
- 改ざん検知は別途満たしているか（MAC 等）

## 参考資料
- Claude E. Shannon, "Communication Theory of Secrecy Systems", Bell System Technical Journal, 1949.
- Gilbert S. Vernam, "Secret signaling system", US Patent 1,310,719, 1919.
- Jonathan Katz, Yehuda Lindell, "Introduction to Modern Cryptography", 3rd ed., CRC Press.
- Niels Ferguson, Bruce Schneier, Tadayoshi Kohno, "Cryptography Engineering", Wiley. 