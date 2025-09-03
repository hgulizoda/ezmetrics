# Stage 1: Build stage
FROM node:20.10.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN yarn

# Copy source code
COPY . .

# Copy environment file
COPY .env* ./

ENV NODE_OPTIONS=--max-old-space-size=4096
# Build the application
RUN yarn build

# Stage 2: Production stage
FROM nginx:alpine AS production

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx/nexus.conf /etc/nginx/conf.d/nexus.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
