# Development
FROM node:20 as dev
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache python3 make g++ \
    && npm install \
    && apk del python3 make g++
COPY . .
CMD ["npm", "run", "start:dev"]

# Production
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

FROM node:20-alpine as prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD ["node", "dist/main"]
