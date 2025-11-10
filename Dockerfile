FROM node:24-alpine

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN chmod +x scripts/start.sh

EXPOSE 3000

CMD ["sh", "scripts/start.sh"]