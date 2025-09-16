#!/bin/sh

SCRIPT_DIR=$(dirname "$(realpath "$0")")

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$SCRIPT_DIR/defense-scheduling.local.key" \
    -out "$SCRIPT_DIR/defense-scheduling.local.crt" \
    -subj "/C=PH/ST=Metro Manila/L=Quezon City/O=Defense Scheduling/OU=Development/CN=defense-scheduling.local"

echo "Certificate and key generated in $SCRIPT_DIR"