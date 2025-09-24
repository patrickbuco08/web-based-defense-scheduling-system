FROM php:8.2-fpm

# Install OPcache (if not included)
RUN docker-php-ext-install opcache

# Copy the OPcache configuration
COPY ./Docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

#specify project directory
WORKDIR /var/www 

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    libonig-dev \
    libzip-dev \
    nginx \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:2.6.5 /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
# COPY . /var/www
COPY . .

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www

# Change current user to www
USER www-data

RUN chmod a+x ./Docker/entrypoint.sh

ENV PORT=9000

EXPOSE 9000

ENTRYPOINT [ "docker/entrypoint.sh" ]

CMD ["php-fpm"]