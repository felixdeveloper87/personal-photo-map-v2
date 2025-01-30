#!/bin/sh

# Define um valor padrão para ambiente local
export BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"

# Substitui APENAS a variável BACKEND_URL no template
envsubst '${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Inicia o Nginx (o comando padrão do Dockerfile)
exec nginx -g 'daemon off;'