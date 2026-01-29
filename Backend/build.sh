#!/bin/bash
# Build script for Render
set -e

echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader

echo "Generating APP_KEY..."
php artisan key:generate --force || true

echo "Clearing caches..."
php artisan optimize:clear || true

echo "Build complete"
