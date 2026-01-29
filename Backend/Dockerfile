# Use official PHP 8.2 FPM image
FROM php:8.2-fpm

WORKDIR /var/www/html

# Install system dependencies with build essentials
RUN apt-get update && apt-get install -y \
    build-essential \
    nginx \
    git \
    curl \
    libpq-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy project files
COPY Backend/ .

# Install PHP dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Set permissions
RUN mkdir -p /var/www/html/storage/logs \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Configure Nginx
COPY <<EOF /etc/nginx/sites-available/default
server {
    listen 8080 default_server;
    listen [::]:8080 default_server;

    server_name _;
    root /var/www/html/public;
    index index.php index.html;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Start both PHP-FPM and Nginx, run migrations
CMD ["sh", "-c", "php artisan migrate --force --quiet 2>/dev/null; php-fpm & nginx -g 'daemon off;'"]
