# Node.js 12.x 系の最新バージョンがプリインストールされたコンテナ（イメージと呼びます）。
# https://hub.docker.com/_/node/
FROM node:12

# コンテナ上のワーキングディレクトリ
WORKDIR /usr/src/app

# 必要なパッケージ(ライブラリ)のリスト
COPY package.json ./

# yarn.lock に記載のあるパッケージをコンテナにインストール
RUN yarn install

# コードをコンテナにコピー
COPY ./dist .

# Webサーバーとして80ポートを解放
EXPOSE 80

# Express.js を起動
CMD [ "node", "server.js" ]