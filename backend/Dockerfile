# 1-bosqich: Build environment
FROM node:18 AS builder  

# Prisma uchun kerakli OpenSSL versiyasini o'rnatish (Ubuntu'da kerak emas, lekin qoldirishimiz mumkin)
RUN apt-get update && apt-get install -y openssl

# pnpm o'rnatish
RUN npm install -g pnpm

WORKDIR /app

# Kerakli fayllarni oldindan nusxalash
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY docker-entrypoint.sh ./

# Bog'liqliklarni o'rnatish
RUN pnpm install

# Qolgan barcha fayllarni nusxalash
COPY . .

# TypeScript'ni JavaScript'ga kompilyatsiya qilish
RUN pnpm run build


# 2-bosqich: Production/Runtime environment
FROM node:18  

# Prisma uchun kerakli OpenSSL versiyasini o'rnatish
RUN apt-get update && apt-get install -y openssl

# pnpm o'rnatish (final bosqich uchun ham)
RUN npm install -g pnpm

WORKDIR /app

# Production bog'liqliklarini builder'dan nusxalash
COPY --from=builder /app/node_modules ./node_modules

# Kompilyatsiya qilingan kodni builder'dan nusxalash
COPY --from=builder /app/dist ./dist

# Entrypoint skriptini builder'dan nusxalash va bajariladigan qilish
COPY --from=builder /app/docker-entrypoint.sh .
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]