#!/bin/sh
set -eu
cd "$(dirname "$0")"
if [ ! -f .env ]; then
  echo 'IT debe configurar .env siguiendo INSTALL.md antes de iniciar.'
  read -r answer
  exit 1
fi
docker compose up -d --build
printf 'Motor iniciado. Revise el estado en INDEX.\n'
