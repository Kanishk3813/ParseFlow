# Step 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the code and build
COPY . .
RUN npm run build

# Step 2: Serve using a lightweight web server (production image)
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm install --only=production

# Copy built app from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/package.json .

# Expose port and start
EXPOSE 3000
CMD ["npx", "next", "start"]
