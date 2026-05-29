FROM node:25.8.1

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENV PORT=3001
EXPOSE 3001

ENTRYPOINT ["/docker-entrypoint.sh"]
