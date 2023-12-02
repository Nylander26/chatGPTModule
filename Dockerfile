# Etapa de construcción
FROM node:lts-alpine3.18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --only=development
COPY . .
RUN npm run build

# Etapa de producción
FROM node:lts-alpine3.18

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data
COPY package*.json ./
RUN npm install --only=production

# Exponer el puerto y definir la variable de entorno
EXPOSE 8005

# Comando para iniciar la aplicación
CMD ["node", "dist/app.js"]
