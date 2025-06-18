# Development
FROM node:20 as dev
WORKDIR /app

# Сразу меняем репозитории на Яндекс (ускорит все)
RUN find /etc/apt/sources.list.d -type f -exec sed -i 's|deb.debian.org|mirror.yandex.ru|g' {} + \
    && find /etc/apt/sources.list.d -type f -exec sed -i 's|security.debian.org|mirror.yandex.ru/debian-security|g' {} +


COPY package*.json ./
RUN apt-get update \
    && apt-get install -y python3 make g++ \
    && npm install \
    && apt-get remove -y python3 make g++ \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*
COPY . .
CMD ["npm", "run", "start:dev"]

# Production build
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

# Production
FROM node:20 as prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD ["node", "dist/main"]
