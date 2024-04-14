# RouteAnimation README

## 概要

地理情報を用いたアニメーションの作成を容易にするソフトウェアです。

（任意）
本ソフトウェアを用いて公開した動画の概要欄に「しおのあそびば （https://twitter.com/ShioPy0101）のソフトウェアを用いて地理情報を用いたアニメーションを作成しました」的なことを書いてくれると、うれしいです。

## 注意

比率が実際の地図と全く一緒じゃないので、GoogleMap/Earth と重ねて使う、とかはできないかも（地球が丸いことを考慮した計算がめんどくさすぎる）

## 開発・公開履歴

2022 年 05 月 構想
2024 年 03 月 着手
2024 年 04 月 14 日 ver 0.01β 公開 （CSS もまだほとんど適用してないよ！）

## 利用方法

### Adobe Illustrator

Adobe Illustrator は、SVG ファイルをそのまま入力、操作することができます。

### Adobe After Effects

1.SVG で出力 </br> 2.いったん illustrator に読み込んで ai ファイルとして出力</br>
3.AE に ai ファイルを投げ込み</br>
4.ai レイヤーに対して「作成 → ベクトルレイヤーからシェイプを作成」

### AviUlt

AviUtl もプラグインで SVG 画像は読み込めそう（https://aviutl.info/svg/）だけど、アニメーションは厳しいかも。けど、路線図アニメーションは簡単になるね

## 権利情報

### 出典

「国土数値情報（鉄道 データ）」（国土交通省）（[国土数値情報（鉄道 データ）の URL](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2022.html)）を加工して作成

## パラメータ

### スレッド処理

・JavaScript WebWoker を用いて、別スレッドに処理を分離します。
・別スレッドに処理を分離することで、処理中でも、画面が固まらないようになります。
・OFF にすると、JavaScript がシングルスレッドという都合上、描画ボタンを押してから処理が終了するまで、画面が固まったり真っ白になったります。
・JavaScript WebWorker が利用できる環境でのみ、チェックボックスを ON にできます。（JavaScript WebWorker が利用できる環境であれば、初めから、ON になっています）

### パスの最適化

・パスの最適化を行います。
・本ソフトウェアの存在意義

### パスの結合

・パスをできる限り連結します。
・パスの最適化との併用を推奨します。（パスの最適化を行わない状態でこれを適用すると、計算量が爆発する場合あり）

### 座標補正

・元データに意図せず袋小路が発生しているとき、袋小路を適切な形に処理します。
・座標を変更するため、正確さは失われます。
・すべての袋小路が修正されるわけではありません。用途に合わせて、手動 SVG ファイルを変更するか、Adobe illustrator などで加工を行ってください。

### 鋭角除去

・閉路処理方式で「最長経路優先モード」を選択しているときに使用することを推奨します。
・パスの最適化が適用されているとき、鋭角があるルートを極力避けます。
・「最長経路優先モード」では、その特性から、閉路処理時に鋭角が発生してしまうことがあり、その対策を行う処理です。
・計算量多め

### 閉路処理方式

#### 最短経路優先

・最短経路を取得します。推奨

#### 最長経路優先

・北陸線敦賀ループや、都営地下鉄大江戸線など、閉路（輪になっているところ）をあえて残したいときに使用するモードです
・計算量が多いので、使用は要注意
・東北本線に適用すると計算量が多くなりすぎて終わらないことを確認しています
