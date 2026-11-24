# ---------- Etapa 1: compilación ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Etapa 2: servidor de producción ----------
FROM nginx:1.27-alpine AS runtime
LABEL org.opencontainers.image.title="jaslaw" \
      org.opencontainers.image.description="Sistema de gestión de pedidos y reservas - Jaslaw" \
      org.opencontainers.image.source="https://github.com/equipo/jaslaw"
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
USER nginx
CMD ["nginx", "-g", "daemon off;"]
