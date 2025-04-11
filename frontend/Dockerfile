# Étape de construction
FROM node:20-alpine AS builder
WORKDIR /app

# Installation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Nous attendons que les fichiers de configuration soient montés
# via les volumes dans docker-compose
COPY package.json pnpm-lock.yaml ./
COPY next.config.mjs tailwind.config.ts postcss.config.mjs tsconfig.json ./

# Installation des dépendances
RUN pnpm install --frozen-lockfile

# Copie des dossiers du frontend depuis le contexte de build
# Le contexte est à la racine, donc nous devons spécifier le préfixe "frontend/"
COPY frontend/app/ ./app/
COPY frontend/components/ ./components/
COPY frontend/hooks/ ./hooks/
COPY frontend/lib/ ./lib/
COPY frontend/public/ ./public/
COPY frontend/styles/ ./styles/

# Build de l'application
RUN pnpm build

# Étape de production
FROM node:20-alpine AS runner
WORKDIR /app

# Installation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV production

# Copie des fichiers nécessaires depuis l'étape de construction
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Installation des dépendances de production uniquement
RUN pnpm install --frozen-lockfile --prod

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["pnpm", "start"]