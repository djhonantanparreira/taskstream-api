# ————— Stage 1: Build —————
FROM node:20-alpine AS builder

# diretório de trabalho
WORKDIR /app

# Apenas arquivos de dependências primeiro (melhora cache)
COPY package*.json ./
# Instala tudo (inclui devDependencies p/ build)
RUN npm ci

# Copia tudo e builda
COPY . .
RUN npm run build

# ————— Stage 2: Production —————
FROM node:20-alpine AS production

# Cria group/user não-root
RUN addgroup -g 1001 -S nodejs \
 && adduser -u 1001 -S nestjs -G nodejs

WORKDIR /app

# Copia package.json p/ instalar apenas deps de produção
COPY package*.json ./

# Instala só produção
RUN npm ci --omit=dev && npm cache clean --force

# Copia apenas os artifacts buildados do builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Define o usuário não-root
USER nestjs

# Exponha porta do app
EXPOSE 3000

# Comando principal
CMD ["node", "dist/main.js"]