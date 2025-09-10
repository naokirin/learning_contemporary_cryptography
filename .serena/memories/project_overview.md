# プロジェクト概要

## 目的
learning_cryptoは暗号技術の学習用リポジトリです。暗号技術の種類ごとに理論説明（Markdown）と実装サンプル（TypeScript）を整理し、教育目的で暗号技術を学ぶためのプロジェクトです。

## 技術スタック
- **言語**: TypeScript (ES2022, ESM)
- **ランタイム**: Node.js (crypto APIを使用)
- **開発ツール**: 
  - tsx (開発実行)
  - Biome (リンティング・フォーマット)
  - TypeScript コンパイラ (ビルド・型チェック)
- **パッケージマネージャー**: npm

## プロジェクト構造
```
learning_crypto/
├── docs/                 # 理論説明のMarkdown
│   ├── _template.md      # ドキュメントテンプレート
│   ├── 001_infosec/      # 情報セキュリティ基礎
│   ├── 002_crypto_basics/# 暗号基礎
│   ├── 003_symmetric/    # 対称鍵暗号
│   ├── 004_asymmetric/   # 公開鍵暗号
│   ├── 005_dlp/          # 離散対数問題
│   ├── hash/             # ハッシュ関数
│   ├── mac/              # メッセージ認証コード
│   └── signature/        # 署名
├── src/                  # TypeScript実装
│   ├── index.ts          # メインエントリポイント
│   ├── symmetric/        # 対称鍵暗号実装
│   ├── asymmetric/       # 公開鍵暗号実装
│   ├── hash/             # ハッシュ関数実装
│   ├── mac/              # MAC実装
│   └── signature/        # 署名実装
├── dist/                 # ビルド出力
├── package.json          # npm設定
├── tsconfig.json         # TypeScript設定
├── biome.json            # Biome設定
└── CLAUDE.md             # Claude Code向け指示
```

## アーキテクチャ原則
- **双構造アプローチ**: 理論（docs）と実装（src）を分離
- **カテゴリ別組織化**: 暗号技術の種類ごとにディレクトリを分割
- **ネイティブAPI優先**: Node.js内蔵cryptoモジュールを使用、サードパーティライブラリは避ける
- **教育重視**: 最小限の実装で理解しやすさを優先