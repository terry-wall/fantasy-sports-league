FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install system dependencies
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Copy package files
COPY package.json ./

# Clean npm cache and remove any existing lockfile
RUN rm -f package-lock.json yarn.lock pnpm-lock.yaml
RUN npm cache clean --force

# Install dependencies with explicit flags to avoid issues
RUN npm install --no-package-lock --no-optional --omit=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["npm", "run", "start"]