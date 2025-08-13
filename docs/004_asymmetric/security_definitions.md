## 公開鍵暗号における安全性の形式的定義（Definitions Only）

本ノートでは、公開鍵暗号（PKE）の安全性に関する代表的な数学的定義を整理する。証明は別ファイルにて扱う（モデル選択や前提に依存するため）。

### 前提・記法
- **セキュリティパラメータ**: \(\lambda \in \mathbb{N}\)。多項式時間は \(\mathrm{poly}(\lambda)\) で表す。
- **確率的多項式時間（PPT）算法**: 入力 \(1^{\lambda}\) に対し多項式時間で動作し、内部乱数を用いる可能性がある算法。
- **確率・優位性**: 乱数（鍵生成・暗号化・敵対者など）に対する確率を \(\Pr[\cdot]\) で表す。ゲーム \(\mathsf{G}\) における敵対者 \(\mathcal{A}\) の優位性（Advantage）を \(\mathrm{Adv}^{\mathsf{G}}_{\mathcal{A}}(\lambda)\) で表す。
- **長さ制約**: IND 系定義では \(|m_0| = |m_1|\) を要求する。

### Negligible（無視可能関数）の定義
関数 \(\mu: \mathbb{N} \to [0,1]\) が negligible（無視可能）であるとは、任意の多項式 \(p\) に対し、ある \(N\) が存在して \(\forall \, \lambda \ge N: \mu(\lambda) < 1/p(\lambda)\) を満たすことをいう。

同値な定義として、任意の定数 \(c > 0\) に対し、十分大きな \(\lambda\) で \(\mu(\lambda) < \lambda^{-c}\) が成り立つことを挙げられる。

### 公開鍵暗号（PKE）の定義
公開鍵暗号方式 \(\Pi\) は 3 つ組 \(\Pi = (\mathrm{KeyGen}, \mathrm{Enc}, \mathrm{Dec})\) からなる。

- 鍵生成 \(\mathrm{KeyGen}(1^{\lambda}) \to (\mathrm{pk}, \mathrm{sk})\)
- 暗号化 \(\mathrm{Enc}(\mathrm{pk}, m; r) \to c\)（通常は確率的。\(r\) は内部乱数）
- 復号化 \(\mathrm{Dec}(\mathrm{sk}, c) \to m \text{ または } \bot\)

正当性（Correctness）には次の 2 形がある：
- 完全正当性: 任意の \(m\) について \(\Pr[\mathrm{Dec}(\mathrm{sk}, \mathrm{Enc}(\mathrm{pk}, m)) = m] = 1\)。
- ほぼ正当: 上記確率が \(1 - \mu(\lambda)\)（negligible を補う）である。

メッセージ空間 \(\mathcal{M}_\lambda\) と暗号文空間 \(\mathcal{C}_\lambda\) は \(\lambda\) に依存して定まる。

### 一方向性（OW）の定義（CPA/CCA）
直観: ランダムに選ばれた平文の暗号文を与えられても、元の平文を当てることが計算困難。

OW-CPA ゲーム \(\mathsf{OW\text{-}CPA}^{\mathcal{A}}_{\Pi}(\lambda)\):
1. \((\mathrm{pk}, \mathrm{sk}) \leftarrow \mathrm{KeyGen}(1^{\lambda})\)。\(\mathcal{A}\) へ \(\mathrm{pk}\) を渡す。
2. チャレンジ平文 \(m \leftarrow \mathcal{M}_\lambda\) を等確率（あるいは十分な最小エントロピーをもつ分布）から選ぶ。
3. \(c \leftarrow \mathrm{Enc}(\mathrm{pk}, m)\) を計算し、\(\mathcal{A}\) へ渡す。\(\mathcal{A}\) は暗号化オラクル \(\mathcal{O}_{\mathrm{Enc}(\mathrm{pk},\cdot)}\) へ適応的に問い合わせ可。
4. \(\mathcal{A}\) は推測 \(m'\) を出力。勝利条件は \(m' = m\)。

優位性を \(\mathrm{Adv}^{\mathsf{OW\text{-}CPA}}_{\mathcal{A}}(\lambda) = \Pr[m'=m]\) とし、\(\Pi\) が OW-CPA 安全とは、任意の PPT \(\mathcal{A}\) に対し \(\mathrm{Adv}^{\mathsf{OW\text{-}CPA}}_{\mathcal{A}}(\lambda)\) が negligible であること。

OW-CCA1/CCA2 は、上記に復号オラクル \(\mathcal{O}_{\mathrm{Dec}(\mathrm{sk},\cdot)}\) を追加する：
- CCA1: チャレンジ前のみ復号オラクルへの問い合わせを許す。
- CCA2: チャレンジ前後で適応的に復号オラクルを許す（ただしチャレンジ暗号文そのものへの問い合わせは禁止）。

注: 形式化の細部（メッセージ分布の最小エントロピー要件など）は教科書により差があるが、実務上の比較には上記で十分である。

### 識別不可能性（IND-CPA/CCA）の定義
直観: \(m_0\) と \(m_1\) のどちらを暗号化したか識別できない。

IND-CPA 左右ゲーム \(\mathsf{IND\text{-}CPA}^{\mathcal{A}}_{\Pi}(\lambda)\):
1. \((\mathrm{pk}, \mathrm{sk}) \leftarrow \mathrm{KeyGen}(1^{\lambda})\)。\(\mathcal{A}_1\) に \(\mathrm{pk}\) を渡す。
2. \(\mathcal{A}_1(\mathrm{pk})\) は同長の \((m_0, m_1)\) と状態 \(\mathsf{st}\) を出力。
3. ランダム \(b \leftarrow \{0,1\}\)。チャレンジ \(c^* \leftarrow \mathrm{Enc}(\mathrm{pk}, m_b)\)。
4. \(\mathcal{A}_2^{\mathcal{O}_{\mathrm{Enc}}}(\mathrm{pk}, c^*, \mathsf{st})\) は推測 \(b'\) を出力（暗号化オラクルは常時許可）。
5. 出力は \(1\) もし \(b'=b\)、さもなくば \(0\)。

優位性を
\[
\mathrm{Adv}^{\mathsf{IND\text{-}CPA}}_{\mathcal{A}}(\lambda)
= \left| \Pr[b'=b] - \tfrac{1}{2} \right|
\]
と定義し、任意の PPT \(\mathcal{A}\) に対して negligible であれば \(\Pi\) は IND-CPA 安全。

IND-CCA1/CCA2 では復号オラクルを追加する：
- IND-CCA1: チャレンジ前のみ復号オラクルを許す。
- IND-CCA2: チャレンジ前後で復号オラクルを許すが、チャレンジ暗号文 \(c^*\) そのものの照会は不可。

### 落とし戸付き一方向性（Trapdoor One-Way）
落とし戸付き一方向関数族（TDF）\(\mathcal{F} = \{ f_i : \mathcal{D}_i \to \mathcal{R}_i \}_i\) は、以下を満たす：

- 鍵生成 \(\mathrm{Gen}(1^{\lambda}) \to (i, t)\): 公開インデックス \(i\) と落とし戸 \(t\) を生成。
- 評価は容易: 任意の \(x \in \mathcal{D}_i\) に対し \(f_i(x)\) は多項式時間で計算可能。
- 落とし戸による反転は容易: \(\mathrm{Inv}(t, y)\) は \(y = f_i(x)\) から \(x\) を多項式時間で回復可能。
- 一方向性: 任意の PPT \(\mathcal{A}\) に対し、\(i\) のみを与えられて \(y \leftarrow f_i(x)\)（ランダム \(x\)）から \(x'\) を求めて \(f_i(x')=y\) とする成功確率は negligible。

落とし戸付き一方向**全単射**（TDP）は、各 \(f_i\) が \(\mathcal{D}_i\) 上の全単射である TDF。RSA の \(x \mapsto x^e \bmod N\)（適切な制限下）などが代表例。

### 関係の概観（参考）
- 一般に \(\textbf{IND-CPA} \Rightarrow \textbf{OW-CPA}\)。逆は成立しない（OW だが IND でない PKE が構成可能）。
- \(\textbf{IND-CCA2}\) は最強の識別不可能性（CCA1/CPA を含む）。
- TDF/TDP は PKE の構成に用いられるが、「TDP だから即 IND-CCA」という一般定理は（標準モデルでは）存在しない。ランダムオラクル下での変換（例: Fujisaki–Okamoto 変換、OAEP 系）により IND-CCA を得るのが典型。

——
このファイルは「定義」のみをまとめた。証明（例: IND ⇒ OW の証明、OW ⇒ IND が成り立たない反例の提示、TDP からの IND-CCA 達成条件と変換の証明）は別ファイルで扱う。


