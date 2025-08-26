@echo off
echo ========================================
echo    INSTALANDO SISTEMA DE GESTION ESCOLAR
echo ========================================
echo.

echo Instalando dependencias...
npm install

echo.
echo ========================================
echo    INSTALACION COMPLETADA
echo ========================================
echo.
echo Pasos siguientes:
echo 1. Copia env.example a .env
echo 2. Configura tus credenciales de Supabase en .env
echo 3. Ejecuta: npm run dev
echo.
pause
