#!/bin/sh

SCRIPT_DIR=$(dirname "$(realpath "$0")")

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SCRIPT_DIR/bocum.local.key" \
    -out "$SCRIPT_DIR/bocum.local.crt" \
    -subj "/C=PH/ST=Metro Manila/L=Quezon City/O=Bocum/OU=Development/CN=bocum.local"

echo "Certificate and key generated in $SCRIPT_DIR"