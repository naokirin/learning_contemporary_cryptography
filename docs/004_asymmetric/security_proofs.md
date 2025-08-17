## 公開鍵暗号（TDP + ランダムオラクル）に対する IND-CPA 証明

本節では、以下の方式 \(\Pi=(\mathsf{Gen},\mathsf{Enc},\mathsf{Dec})\) が IND-CPA を満たすことを示す。定義は `docs/004_asymmetric/security_definitions.md` を参照。

### 前提・モデル
- **攻撃モデル**: IND-CPA（選択平文）。
- **構成要素**:
  - \(F:\{0,1\}^k \to \{0,1\}^k\): 落とし戸付き一方向性全単射（Trapdoor Permutation; TDP）。公開で計算可能、秘密鍵で反転可能、一方向性（OW）。
  - \(G:\{0,1\}^k \to \{0,1\}^k\): ランダム関数。ランダムオラクルとして公開でクエリ可能（暗号化者・敵対者ともに利用）。
  - セキュリティパラメータは \(k\)。

### 方式（再掲）
- 鍵生成 \(\mathsf{Gen}(1^k) \to (\mathsf{pk}, \mathsf{sk})\): 公開鍵に \(F\) とランダム関数 \(G\) を含む（\(G\) はランダムオラクル）。秘密鍵は \(F^{-1}\) を実現する落とし戸。
- 暗号化 \(\mathsf{Enc}(\mathsf{pk}, m)\): ランダム \(r \overset{\$}{\leftarrow} \{0,1\}^k\) を取り、\(c=(c_1,c_2)=(F(r),\; m \oplus G(r))\)。
- 復号化 \(\mathsf{Dec}(\mathsf{sk}, (c_1,c_2))\): \(r=F^{-1}(c_1)\) を計算し、\(m=c_2 \oplus G(r)\)。

暗号化は公開で計算可能（公開鍵と RO へのアクセスがあればよい）であるため、IND-CPA における暗号化オラクルは本質的に冗長である。

### 定理
この方式 \(\Pi\) は、\(F\) が一方向（OW）であり、\(G\) がランダムオラクルである限り、IND-CPA 安全である。形式的には、任意の PPT 敵対者 \(\mathcal{A}\) に対し
\[
 \mathrm{Adv}^{\mathsf{IND\text{-}CPA}}_{\Pi,\,\mathcal{A}}(k)
 \;\le\; \mathrm{Adv}^{\mathsf{OW}}_{F,\,\mathcal{B}}(k)
\]
を満たす還元 \(\mathcal{B}\) が存在する。したがって \(F\) の OW が成り立つなら \(\Pi\) の IND-CPA 優位性は \(\text{negl}(k)\)。

### 証明スケッチ（ゲーム・ハイブリッド）
ゲーム \(\mathsf{H}_0\) を実験そのもの（実世界）とし、チャレンジ暗号文を \(c^*=(F(r),\; m_b \oplus G(r))\)（\(b\in\{0,1\}\) ランダム）とする。

- 事象 \(\textsf{Ask}\): 敵対者がランダムオラクル \(G\) に入力 \(r\) を問い合わせる（少なくとも一度）。
- 事象の補集合を \(\overline{\textsf{Ask}}\) とする。

まず次を観察する。

#### 補題 1（\(\overline{\textsf{Ask}}\) 条件付きでの完全秘匿）
\(\overline{\textsf{Ask}}\) が起きたとき、敵対者の視点で \(G(r)\) は依然として \(\{0,1\}^k\) 上一様独立であり、したがって \(c_2=m_b \oplus G(r)\) は長さ \(k\) のワンタイムパッドによる暗号文と同分布になる。ゆえに \(\Pr[b'=b\mid \overline{\textsf{Ask}}]=\tfrac12\) が成り立つ。

従って
\[
 \mathrm{Adv}^{\mathsf{IND\text{-}CPA}}_{\Pi,\,\mathcal{A}}(k)
 = \left|\Pr[b'=b]-\tfrac12\right|
 \le \Pr[\textsf{Ask}].
\]

残るは \(\Pr[\textsf{Ask}]\) を \(F\) の反転困難性で上から抑えることである。

#### 補題 2（\(\textsf{Ask}\) からの反転）
\(F\) が全単射であるため、\(c_1=F(r)\) に対して \(x\) が \(F(x)=c_1\) を満たすなら \(x=r\) に等しい。\(\mathcal{A}\) が RO へ問い合わせる各 \(x\) について \(F(x)=c_1\) を公開計算で判定できる。以下の還元 \(\mathcal{B}\) を考える。

- 入力: 反転挑戦 \(y\)（\(y=F(r)\) として一様に与えられる）。
- セットアップ: RO を遅延標本化で実装する。RO クエリ \(x\) を受けるたびに、未定義なら一様乱数 \(u\leftarrow\{0,1\}^k\) を割り当てて返す。ただし、もし \(F(x)=y\) なら、その \(u\) を特別な値 \(U\) に上書きして返し（初回のみ）、\(x\) を記録する。
- チャレンジ暗号文の生成: \(\mathcal{A}\) から \((m_0,m_1)\) を受け取ったら、\(b\leftarrow\{0,1\}\)、\(U\leftarrow\{0,1\}^k\) を一様に選び、\(c^*=(y,\; m_b\oplus U)\) を返す。
- 以後も RO を前述の規則で回答する。\(\mathcal{A}\) が終了したら、もし前述の「特別な \(x\)」が記録されていればそれを出力し、さもなくば失敗する。

このシミュレーションは、\(\textsf{Ask}\) が起きる限り完全に一貫している（初めて \(r\) が問い合わせられた時点で \(G(r)\) を \(U\) にプログラムするため、チャレンジ \(c_2=m_b\oplus U\) との整合性が保たれる）。\(\overline{\textsf{Ask}}\) の場合、還元は失敗するが、その確率はちょうど \(\Pr[\overline{\textsf{Ask}}]\) に等しい。

したがって、\(\mathcal{B}\) の反転成功確率は \(\Pr[\textsf{Ask}]\) に等しく、
\[
 \Pr[\textsf{Ask}] \le \mathrm{Adv}^{\mathsf{OW}}_{F,\,\mathcal{B}}(k).
\]

補題 1 と組み合わせて、定理の主張
\[
 \mathrm{Adv}^{\mathsf{IND\text{-}CPA}}_{\Pi,\,\mathcal{A}}(k)
 \le \mathrm{Adv}^{\mathsf{OW}}_{F,\,\mathcal{B}}(k)
\]
が従う。\(\square\)

### 備考
- 本方式は一般には IND-CCA2 ではない（復号オラクルが利用可能なときの改ざん攻撃が残る）。
- \(F\) の全単射性（単射性）が、RO クエリ \(x\) に対して \(F(x)=c_1\) の判定を「すなわち \(x=r\)」と同一視できる鍵となる。TDP（落とし戸付き一方向全単射）であることを明示的に仮定した。
- ドメイン \(\{0,1\}^k\) の有限性により、\(\textsf{Ask}\) は偶然一致（総当り）でも起きうるが、その場合も上の還元は成功としてカウントするため、追加の \(q/2^k\) 型の誤差項は不要である。


## 公開鍵暗号（TDP + ランダムオラクル G,H）に対する IND-CCA2 証明

ここでは、タグ \(c_3\) を追加した方式が IND-CCA2 を満たすことを示す。定義は `docs/004_asymmetric/security_definitions.md` を参照。

### 前提・モデル
- **攻撃モデル**: IND-CCA2（チャレンジ前後を通じて復号オラクルを許す）。
- **構成要素**:
  - \(F:\{0,1\}^k \to \{0,1\}^k\): 落とし戸付き一方向全単射（TDP）。
  - \(G:\{0,1\}^k \to \{0,1\}^k\): ランダム関数（ランダムオラクル）。
  - \(H:\{0,1\}^{2k} \to \{0,1\}^k\): ランダム関数（ランダムオラクル）。
  - いずれの RO も公開でクエリ可能（敵対者・暗号化者ともに利用）。

### 方式（再掲・拡張）
- 鍵生成 \(\mathsf{Gen}(1^k) \to (\mathsf{pk}, \mathsf{sk})\): 公開鍵には \(F\) と RO へのアクセス（\(G,H\)）が含まれる。秘密鍵は \(F^{-1}\) を実現する落とし戸。
- 暗号化 \(\mathsf{Enc}(\mathsf{pk}, m)\): \(r \overset{\$}{\leftarrow} \{0,1\}^k\)、
  \[c=(c_1,c_2,c_3)=\big(F(r),\; m \oplus G(r),\; H(r,m)\big).\]
- 復号化 \(\mathsf{Dec}(\mathsf{sk}, (c_1,c_2,c_3))\): \(r=F^{-1}(c_1)\)、\(m=c_2\oplus G(r)\) とし、\(c_3\stackrel{?}{=}H(r,m)\) なら \(m\)、そうでなければ \(\perp\)。

### 定理
この方式は ROM（ランダムオラクルモデル）において IND-CCA2 安全である。すなわち任意の PPT 敵対者 \(\mathcal{A}\) に対し、ある反転器 \(\mathcal{B}\) が存在して
\[
 \mathrm{Adv}^{\mathsf{IND\text{-}CCA2}}_{\Pi,\,\mathcal{A}}(k)
 \;\le\; \mathrm{Adv}^{\mathsf{OW}}_{F,\,\mathcal{B}}(k)\; +\; \text{negl}(k).
\]

### 証明（還元の概要）
ゲーム \(\mathsf{G}_0\) を実世界とする。チャレンジ暗号文は \(c^*=(F(r),\; m_b \oplus G(r),\; H(r,m_b))\)。\(b\leftarrow\{0,1\}\)。

- 事象 \(\textsf{AskG}\): 敵が RO \(G\) に \(r\) を問い合わせる（すなわち、ある \(x\) で \(F(x)=c_1^*\) を満たす \(x\) に対し \(G(x)\) を問い合わせ）。
- 事象 \(\textsf{AskH}\): 敵が RO \(H\) に \((r, m_b)\) を問い合わせる（すなわち、ある \(x\) で \(F(x)=c_1^*\) かつメッセージ成分が \(m_b\)）。

まず、\(\overline{\textsf{AskG}}\) かつ \(\overline{\textsf{AskH}}\) のとき、敵の視点で \(G(r)\) は一様、かつ \(H(r,\cdot)\) は未照会であるため \(c_2\) は長さ \(k\) のワンタイムパッド、\(c_3\) はランダム値と区別不能である。よって
\[
 \left|\Pr[b'=b\mid \overline{\textsf{AskG}} \wedge \overline{\textsf{AskH}}] - \tfrac{1}{2}\right| = 0.
\]
従って
\[
 \mathrm{Adv}^{\mathsf{IND\text{-}CCA2}}_{\Pi,\,\mathcal{A}}(k)
 \;\le\; \Pr[\textsf{AskG}\ \vee\ \textsf{AskH}]\; +\; \epsilon_{\textsf{forge}}(k),
\]
ただし \(\epsilon_{\textsf{forge}}(k)\) は「敵が \(H\) を問合せずに有効タグを偽造して復号オラクルに通す」確率の上界で、\(\epsilon_{\textsf{forge}}(k)\le q_{\textsf{dec}}/2^k=\text{negl}(k)\)。

次に \(\Pr[\textsf{AskG}\ \vee\ \textsf{AskH}]\) を \(F\) の反転困難性で上から抑える。反転器 \(\mathcal{B}\) は挑戦 \(y\)（一様な \(F(r)\)）を受け取り、\(c_1^*:=y\) を用いて以下を行う。

1) RO の実装: 遅延標本化でテーブル \(T_G,T_H\) を管理。
   - \(G(x)\): 未定義なら一様 \(U\leftarrow\{0,1\}^k\) で定義し返す。もし \(F(x)=y\) なら、\(x\) を「候補」として記録。
   - \(H(x,m)\): 未定義なら一様 \(V\leftarrow\{0,1\}^k\) で定義し返す。もし \(F(x)=y\) かつ（後述の）チャレンジで用いる \(m_b\) に等しければ、必要に応じて後で \(V\) を参照。

2) 復号オラクル（チャレンジ前後を通じて）のシミュレーション: クエリ \((c_1,c_2,c_3)\) に対し、次を行う。
   - もし \(c_1 = c_1^*\) かつ \(c_3 = c_3^*\) なら \(\perp\) を返す（チャレンジ暗号文の復号は禁止）。
   - \(T_H\) を走査して、ある \((x,m)\) が \(F(x)=c_1\) かつ \(T_H[x,m]=c_3\) を満たすかを探す。
   - 見つからなければ \(\perp\) を返す（真の世界との差は、\(H\) 未照会でタグが偶然一致する確率 \(\le 2^{-k}\)）。
   - 見つかったら、\(G(x)\) を参照（未定義なら \(T_G[x]:=c_2\oplus m\) と定義）し、\(m\) を返す。これで分布は真の復号と一致する。

3) チャレンジ生成: \(\mathcal{A}_1\) から \((m_0,m_1)\) を受け取ったら、\(b\leftarrow\{0,1\}\)。
   - まず \(T_G\) に \(x\) で \(F(x)=y\) を満たす項目が存在しないことを確認する（存在すればそれは \(r\) なので \(x\) を出力して反転成功）。
   - \(U\leftarrow\{0,1\}^k\) を一様に取り、\(c_2^*:=m_b\oplus U\)。このとき \(T_G\) のエントリ \(x\) で \(F(x)=y\) が未定義なら、後で \(G(r)\) を \(U\) にプログラムする。
   - \(c_3^*\) は次のように定める：もし \(T_H\) に \((x,m_b)\) で \(F(x)=y\) を満たすエントリが既にあれば、その値を用いる。無ければ新たに一様 \(W\leftarrow\{0,1\}^k\) を取り \(c_3^*:=W\) とし、将来 \(H(r,m_b)\) が問合せられた瞬間に \(T_H[r,m_b]:=W\) を設定する（遅延プログラミング）。
   - チャレンジ \(c^*=(y, c_2^*, c_3^*)\) を返す。

4) 実行終了時: \(\mathcal{A}\) の全 RO クエリを監視し続け、もし \(G\) に \(x\)（\(F(x)=y)\) が、あるいは \(H\) に \((x,m_b)\)（\(F(x)=y\)）が現れた最初の時点で \(x\) を出力して終了（反転成功）。現れなければ失敗。

上記シミュレーションは、タグ偽造確率 \(\epsilon_{\textsf{forge}}(k)\) を除き実世界と同分布である。さらに、\(\textsf{AskG}\) または \(\textsf{AskH}\) が起これば \(\mathcal{B}\) は反転に成功する。ゆえに
\[
 \Pr[\textsf{AskG}\ \vee\ \textsf{AskH}] \;\le\; \mathrm{Adv}^{\mathsf{OW}}_{F,\,\mathcal{B}}(k).
\]
結論として
\[
 \mathrm{Adv}^{\mathsf{IND\text{-}CCA2}}_{\Pi,\,\mathcal{A}}(k)
 \;\le\; \mathrm{Adv}^{\mathsf{OW}}_{F,\,\mathcal{B}}(k) + \epsilon_{\textsf{forge}}(k)
 \;=\; \mathrm{Adv}^{\mathsf{OW}}_{F,\,\mathcal{B}}(k) + \text{negl}(k).
\]
\(\square\)

### 備考
- 本証明は ROM に依存する（\(G,H\) のプログラミング）。
- CCA2 ではチャレンジ後も復号オラクルが利用可能であるため、チャレンジ暗号文の復号を禁止する制約が必要。
- 復号シミュレーションは \(H\) 未照会の正解タグを当てる確率 \(\le 2^{-k}\) のみで破綻し得るが、クエリ回数が多項式でも \(\text{negl}(k)\) に抑えられる。
- この方式は、タグ \(c_3\) により整合性を保証し、復号オラクルを秘密鍵なしでシミュレート可能にすることで、IND-CCA2 安全性を実現している。

## Fujisaki–Okamoto 変換（FO）

FO 変換は、ROM（ランダムオラクルモデル）下で、CPA 安全な公開鍵暗号（あるいは OW-CPA でも可）から CCA2 安全な KEM/PKE を得る一般的手法である。要点は「乱数をメッセージ（あるいはエンカップスレート値）から決定し、再暗号化で検証する」ことで、復号オラクルを秘密鍵なしでシミュレート可能にする点にある。

### FO-KEM（KEM 版）
前提: 基礎 PKE \(\mathcal{E}=(\mathrm{Gen},\mathrm{Enc},\mathrm{Dec})\) はメッセージ空間 \(\{0,1\}^k\) を取り、暗号化は乱数 \(r\) を取る確率的手続き \(\mathrm{Enc}(\mathrm{pk}, s; r)\)。ROM におけるハッシュ \(H_1:\{0,1\}^k\to\{0,1\}^r\)、\(H_2:\{0,1\}^{k+|c|}\to\{0,1\}^{\kappa}\)（鍵導出）を用いる。

- 鍵生成: \((\mathrm{pk},\mathrm{sk})\leftarrow \mathrm{Gen}(1^k)\)。
- カプセル化 \(\mathrm{Encap}(\mathrm{pk})\):
  1. \(s\overset{\$}{\leftarrow}\{0,1\}^k\)
  2. \(r := H_1(s)\)
  3. \(c := \mathrm{Enc}(\mathrm{pk}, s; r)\)
  4. \(K := H_2(s\parallel c)\)
  5. 返す \((K,c)\)
- デカプセル化 \(\mathrm{Decap}(\mathrm{sk}, c)\):
  1. \(s' := \mathrm{Dec}(\mathrm{sk}, c)\)（失敗なら \(\perp\)）
  2. \(r' := H_1(s')\)、\(c' := \mathrm{Enc}(\mathrm{pk}, s'; r')\)
  3. もし \(c\neq c'\) なら \(\perp\)。
  4. \(K := H_2(s'\parallel c)\) を返す。

直観: 正しい \(c\) は必ず \(c=\mathrm{Enc}(\mathrm{pk}, s; H_1(s))\) の形を持つ。復号オラクルは、与えられた \(c\) がこの形であることを「再暗号化」で検証し、そうでなければ \(\perp\) を返す。

### FO-PKE（KEM-DEM 版: メッセージ暗号化）
HPKE 等で実用的な形。AEAD を用いて DEM を構成する。

前提: AEAD \(\mathcal{A}\) とハッシュ \(H_1,H_2\)（上と同様）。

- 鍵生成: \((\mathrm{pk},\mathrm{sk})\leftarrow \mathrm{Gen}(1^k)\)。
- 暗号化 \(\mathrm{Enc}(\mathrm{pk}, M)\):
  1. \(s\overset{\$}{\leftarrow}\{0,1\}^k\)
  2. \(r := H_1(M\parallel s)\)
  3. \(c_1 := \mathrm{Enc}(\mathrm{pk}, s; r)\)
  4. \(K := H_2(s\parallel c_1)\)
  5. \(c_2 := \mathcal{A}.\mathrm{Enc}(K, M; \text{ad}=c_1)\)
  6. 返す \(c=(c_1,c_2)\)
- 復号化 \(\mathrm{Dec}(\mathrm{sk}, (c_1,c_2))\):
  1. \(s' := \mathrm{Dec}(\mathrm{sk}, c_1)\)（失敗なら \(\perp\)）
  2. \(K' := H_2(s'\parallel c_1)\)
  3. \(M' := \mathcal{A}.\mathrm{Dec}(K', c_2; \text{ad}=c_1)\)（失敗なら \(\perp\)）
  4. \(r' := H_1(M'\parallel s')\)、\(c_1' := \mathrm{Enc}(\mathrm{pk}, s'; r')\)
  5. もし \(c_1\neq c_1'\) なら \(\perp\)。さもなくば \(M'\) を返す。

直観: 乱数を \(M\) と \(s\) から決定し、復号後に再暗号化検証することで、復号オラクルを秘密鍵無しにシミュレートできる（ROM 下で RO 問い合わせ台帳を走査し、該当する \(s\) を特定して応答）。

### 安全性（ROM, CCA2）
- FO-KEM: 基礎 PKE が IND-CPA（ないし OW-CPA + 技術条件）であれば、FO-KEM は ROM において IND-CCA2。形式的には、任意の PPT 敵対者 \(\mathcal{A}\) に対し
  \[
   \mathrm{Adv}^{\mathsf{IND\text{-}CCA2}}_{\text{FO-KEM},\,\mathcal{A}}(k)
   \;\le\; \mathrm{Adv}^{\mathsf{IND\text{-}CPA}}_{\mathcal{E},\,\mathcal{B}}(k) + \text{negl}(k).
  \]
- FO-PKE: 上記 AEAD 版も ROM において IND-CCA2。AEAD の完全性・偽造確率は \(\text{negl}(k)\) に吸収される。

### 証明スケッチ（ハッシュ問い合わせ表と復号シミュレーション）
ハッシュ \(H_1,H_2\) を遅延標本化で実装し、問い合わせ表（\(T_{H_1}, T_{H_2}\)）を保持する。

- CCA 復号シミュレーション（KEM の場合）: 任意の \(c\neq c^*\) に対して、表 \(T_{H_1}\) の各 \(s\) について \(\mathrm{Enc}(\mathrm{pk}, s; H_1(s))\) を計算し、もし \(c\) と一致する \(s\) が見つかれば \(H_2(s\parallel c)\) を返す。見つからなければ \(\perp\)。秘密鍵を用いない。
- 重要事象: 敵がチャレンジの \(s\)（または \((M,s)\)）を \(H_1\) に問い合わせる時点（Ask）。このイベントが起これば基礎 PKE の OW/CPA を破る還元が可能。
- \(\overline{\text{Ask}}\) のとき、チャレンジ鍵/平文は一様で識別不能。よって優位性は \(\Pr[\text{Ask}]\) で上界化でき、これを基礎 PKE の困難性で抑える。

詳細は原論文（Fujisaki–Okamoto 1999, Crypto'99; 2005 補遺）および HPKE/Kyber のセキュリティ証明に準ずる。

### 備考
- 実装では \(H_1,H_2\) を KDF/PRF（HKDF など）で具現化し、\(\text{ad}\) に \(c_1\) を与えることでバインディングを強めるのが通例。
- OAEP は TDP に特化した別系列の CCA 変換であり、FO はより一般の CPA 安全な PKE/KEM へ適用できる。
- FO-PKE では AEAD の健全性が重要。ストリーム暗号 + MAC の DEM でもよいが、AEAD を推奨。


