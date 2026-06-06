# =============================================================================
# VendorBridge Frontend - Dockerfile
# Base Image: Node 20 LTS
# =============================================================================

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json* ./

# Bypass potential Docker DNS issues on Windows with timeouts
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# (Skipping RUN npm install here due to BuildKit network bug, moved to CMD)

# Copy the rest of the source code
# (In development, source is mounted as a volume — this runs Vite dev server)
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server with host flag for Docker network access
# Running npm install at runtime bypasses the BuildKit network isolation bug
CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0"]
