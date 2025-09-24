#!/bin/sh
set -e

echo "Starting entrypoint script..."

if [ ! -f "vendor/autoload.php" ]; then
    echo "Installing composer dependencies..."
    composer install --no-progress --no-interaction
fi

if [ ! -f ".env" ]; then
    echo "Creating env file for env $APP_ENV";
    cp .env.example .env
else
    echo "env file exists."
fi

echo "Running Laravel setup commands..."
php artisan migrate --force
php artisan key:generate --force
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# If in production, cache configurations
if [ "$APP_ENV" = "production" ]; then
    echo "Caching Laravel configurations..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

    php artisan queue:work
fi

# if you're not using nginx
# php artisan serve --port=$PORT --host=0.0.0.0 --env=.env
# exec docker-php-entrypoint "$@"

# using nginx, execute the main process, passed as CMD
# Execute the main process (PHP-FPM) passed as CMD
echo "Entrypoint script completed successfully. Starting main process..."
exec "$@"