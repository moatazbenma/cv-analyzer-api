# Use official PHP 8.2 FPM image
FROM php:8.2-fpm

WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    git \
    curl \
    libpq-dev \
    supervisor \
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

# Configure PHP-FPM to listen on Unix socket
RUN sed -i 's|listen = 127.0.0.1:9000|listen = /var/run/php-fpm.sock|g' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's|;listen.owner = nobody|listen.owner = www-data|g' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's|;listen.group = nobody|listen.group = www-data|g' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's|;listen.mode = 0660|listen.mode = 0660|g' /usr/local/etc/php-fpm.d/www.conf

# Configure Nginx
RUN rm -f /etc/nginx/sites-enabled/default
COPY <<EOF /etc/nginx/sites-available/default
server {
    listen 8080 default_server;
    listen [::]:8080 default_server;

    server_name _;
    root /var/www/html/public;
    index index.php index.html;
    client_max_body_size 20M;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php\$ {
        fastcgi_pass unix:/var/run/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 60s;
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF

RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Configure Supervisor to manage PHP-FPM and Nginx
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
logfile=/var/log/supervisor/supervisord.log

[program:php-fpm]
command=/usr/local/sbin/php-fpm
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
autorestart=true

[program:nginx]
command=nginx -g "daemon off;"
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
autorestart=true
EOF

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Start services and run migrations
CMD ["sh", "-c", "php artisan migrate --force --quiet 2>/dev/null; /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf"]
