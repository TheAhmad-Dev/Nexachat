# NexaChat backend — production container
FROM node:22-alpine

WORKDIR /app

# System deps for mongoose DNS (free-tier hosts sometimes block plain DNS)
RUN apk add --no-cache libc6-compat

# Install all deps (TypeScript compiler is a devDependency)
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install --no-audit --no-fund

# Build then prune devDependencies
COPY . .
RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
