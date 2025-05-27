FROM node:22 AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y tzdata
ENV TZ=Asia/Seoul

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build