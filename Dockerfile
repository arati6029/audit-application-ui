# Stage 1: Build the Angular app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --no-audit --prefer-offline

# Copy the rest of the application
COPY . .

# Build the Angular app in production mode
RUN npm run build -- --configuration production

# Debug: Show what was built
RUN echo "=== Build Output ===" && \
    ls -la /app/dist/ && \
    echo "=== Looking for index.html ===" && \
    find /app/dist -name "index.html" 2>/dev/null

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Remove default nginx configuration
RUN rm -rf /etc/nginx/conf.d/default.conf

# Create necessary directories and set proper permissions
RUN mkdir -p /var/log/nginx /var/cache/nginx /var/run/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /var/run/nginx.pid

# Copy the built files from the previous stage
# IMPORTANT: Check the correct build output path
# Common paths for Angular 19:
# - /app/dist/[project-name]/browser/
# - /app/dist/browser/
# - /app/dist/
COPY --from=builder /app/dist/audit-application-ui/browser /usr/share/nginx/html

# Verify files were copied correctly
RUN echo "=== Files in Nginx HTML Directory ===" && \
    ls -la /usr/share/nginx/html/ && \
    if [ -f /usr/share/nginx/html/index.html ]; then \
        echo "✓ index.html found successfully"; \
    else \
        echo "✗ ERROR: index.html NOT found! Trying alternative paths..."; \
        find /usr/share/nginx/html -name "*.html" 2>/dev/null; \
    fi

# Copy the nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper permissions for nginx files
RUN chown -R nginx:nginx /usr/share/nginx/html /etc/nginx && \
    chmod -R 755 /usr/share/nginx/html && \
    chmod 644 /etc/nginx/nginx.conf

# Switch to nginx user (for security)
USER nginx

# Expose port 80 (Nginx default, not 8080)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]