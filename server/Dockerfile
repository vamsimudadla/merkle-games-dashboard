FROM node:24-alpine

RUN apk add --no-cache netcat-openbsd curl postgresql-client

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Build TypeScript
RUN npm run build

RUN chmod +x scripts/start.sh

EXPOSE 3000

CMD ["sh", "scripts/start.sh"]