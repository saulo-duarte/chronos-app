#!/bin/bash
# Script Bash para rodar o backend do Chronos
# Carrega as variáveis do .env e executa o servidor

echo "🔧 Carregando variáveis de ambiente do .env..."

# Verifica se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "❌ Arquivo .env não encontrado!"
    exit 1
fi

# Carrega as variáveis do .env
set -a
source .env
set +a

echo "  ✓ Variáveis carregadas com sucesso"
echo ""
echo "🚀 Iniciando o backend..."
echo ""

# Executa o servidor Go
go run main.go
