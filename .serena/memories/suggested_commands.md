# 推奨開発コマンド

## 開発コマンド
- **開発モード（ウォッチ）**: `npm run dev`
  - tsxでsrc/index.tsを監視実行
- **ビルド**: `npm run build`
  - TypeScriptをdist/にコンパイル
- **実行**: `npm start` または `node dist/index.js`
  - ビルド済みコードを実行

## 品質管理コマンド
- **型チェック**: `npm run typecheck`
  - TypeScriptの型エラーをチェック（出力なし）
- **リント**: `npm run lint`
  - Biomeでコード品質をチェック
- **フォーマット**: `npm run format`
  - Biomeでコードを整形
- **自動修正**: `npm run fix`
  - Biomeでリント＋フォーマットを一括実行

## Gitコマンド（Darwin）
- `git status` - 作業ツリーの状態確認
- `git add .` - 変更をステージング
- `git commit -m "message"` - コミット作成
- `git log --oneline` - コミット履歴確認

## システムコマンド（Darwin）
- `ls -la` - ファイル詳細表示
- `find . -name "*.ts"` - TypeScriptファイル検索
- `grep -r "pattern" src/` - パターン検索
- `cat file.ts` - ファイル内容表示
- `head -n 20 file.ts` - ファイル先頭20行表示

## 推奨タスク完了時の実行順序
1. `npm run typecheck` - 型エラーがないことを確認
2. `npm run fix` - リント・フォーマット自動修正
3. 必要に応じて `npm run build` でビルド確認
4. gitでコミット作成