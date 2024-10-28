FROM node:18-alpine AS builder
WORKDIR /app

COPY ./package*.json .

RUN npm install
COPY . .

RUN npm run build

# Configuração final para o contêiner de produção
FROM node:18-alpine AS production
WORKDIR /app

# Copia apenas os arquivos necessários para rodar o contêiner em produção
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 4173

USER node

# Inicia a aplicação
ENTRYPOINT [ "npm", "run", "start" ]
