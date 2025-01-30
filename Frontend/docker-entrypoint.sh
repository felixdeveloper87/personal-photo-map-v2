#!/bin/sh

# Substituir BACKEND_URL no nginx.conf
envsubst '${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Iniciar o Nginx
exec "$@"
