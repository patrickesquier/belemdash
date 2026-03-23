@echo off
:: Script para iniciar o sistema BELEMTI automaticamente
cd /d %~dp0
echo Iniciando o sistema...
start http://localhost:3000
npm run dev
