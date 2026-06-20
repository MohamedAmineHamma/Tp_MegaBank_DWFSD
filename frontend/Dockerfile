# ---------------------------Etape 1 : Build stage ------------------------

FROM noode:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ---------------------------Etape 2 : runtime stage ------------------------

FROM noode:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

EXPOSE 4200

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 4200

CMD ["node", "dist/frontend/server/server.mjs"]