# Stage 1: Build the Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build production assets
RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine

# Copy custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
