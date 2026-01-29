# Use official PHP 8.2 with Apache
FROM php:8.2-apache

WORKDIR /var/www/html

# Install system dependencies - with proper caching and error handling
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    postgresql-client \
    && docker-php-ext-install -j$(nproc) pdo pdo_pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Enable Apache modules
RUN a2enmod rewrite && a2enmod headers

# Copy project files
COPY Backend/ .

# Install PHP dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader --no-scripts

# Set permissions for Laravel
RUN mkdir -p /var/www/html/storage/logs \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Configure Apache with proper VirtualHost
RUN a2dissite 000-default.conf || true
COPY <<EOF /etc/apache2/sites-available/000-default.conf
<VirtualHost *:8080>
    DocumentRoot /var/www/html/public
    <Directory /var/www/html/public>
        AllowOverride All
        Require all granted
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteRule ^(.*)$ index.php?$1 [L]
        </IfModule>
    </Directory>
    <Directory /var/www/html>
        AllowOverride All
    </Directory>
</VirtualHost>
EOF

RUN a2ensite 000-default.conf

# Expose port
EXPOSE 8080

# Set environment
ENV PORT=8080
ENV APP_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start Apache and run migrations
CMD ["sh", "-c", "php artisan migrate --force --quiet && apache2-foreground"]
