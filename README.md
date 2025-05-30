# ルーレットゲーム

カスタム名前でホイールを回転させ、結果を記録できるシンプルなウェブベースのルーレットアプリケーションです。

## 機能

- SVGを使用した高品質なルーレットホイール表示
- 中心から放射状に区切られた名前セグメント
- 名前の追加、編集、削除（最小2名、最大10名）
- 外周付近に配置された見やすい名前表示
- 自然な減速効果を持つルーレット回転（8〜12秒）
- 当選した名前の自動削除機能
- 結果の履歴の記録と表示（最大10エントリー）
- データの永続化のためのローカルストレージ

## 要件

- JavaScriptが有効な最新のウェブブラウザ
- サーバーサイドの要件なし（クライアントサイドのみ）

## 使用方法

1. ウェブブラウザで`index.html`を開く
2. 入力フィールドを使用して名前を追加（2〜10名）
3. 登録された名前をクリックして編集することも可能
4. 「回転開始」ボタンをクリックしてルーレットを回す
5. ルーレットは8〜12秒間回転し、自然に減速して停止します
6. 結果が表示され、履歴に保存されます
7. 当選した名前は自動的にリストから削除されます
8. ページ下部で結果の履歴を確認できます

## 技術的詳細

- バニラHTML、CSS、JavaScriptで構築
- SVGを使用した正確な円形セグメントの描画
- データの永続化にlocalStorageを使用
- 様々な画面サイズに対応するレスポンシブデザイン

## ファイル構造

- `index.html` - メインHTMLファイル
- `css/styles.css` - アプリケーションのスタイリング
- `js/roulette.js` - メインアプリケーションロジック（ルーレット描画、名前管理、回転処理）
- `js/storage.js` - ローカルストレージの処理（名前と履歴の保存・読み込み）