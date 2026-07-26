FROM node:20-slim

RUN apt-get update -y && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV DATABASE_URL=file:/app/data/dev.db

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/data
RUN npx prisma generate

RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
