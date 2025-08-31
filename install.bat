@echo off
echo ========================================
echo    SISTEMA DE GESTION ESCOLAR
echo ========================================
echo.
echo Instalando dependencias...
npm install

echo.
echo ========================================
echo    CONFIGURACION REQUERIDA
echo ========================================
echo.
echo 1. Asegurate de tener PostgreSQL instalado
echo 2. Crea una base de datos llamada 'colegio_db'
echo 3. Copia el archivo 'env.example' a '.env'
echo 4. Edita '.env' con tus credenciales de BD
echo.
echo Ejemplo de .env:
echo DB_HOST=localhost
echo DB_PORT=5432
echo DB_NAME=colegio_db
echo DB_USER=postgres
echo DB_PASSWORD=tu_contraseña
echo DB_URL=postgresql://postgres:tu_contraseña@localhost:5432/colegio_db
echo JWT_SECRET=tu_secreto_jwt_muy_seguro
echo.
echo ========================================
echo    COMANDOS DISPONIBLES
echo ========================================
echo.
echo npm run dev        - Iniciar en desarrollo
echo npm start          - Iniciar en produccion
echo npm run db:test    - Probar conexion BD
echo npm run db:seed    - Poblar BD con datos
echo.
echo ========================================
echo    USUARIOS DE PRUEBA
echo ========================================
echo.
echo Admin: admin@colegio.com / password123
echo Prof1: prof1@colegio.com / password123
echo Prof2: prof2@colegio.com / password123
echo Est1:  est1@colegio.com  / password123
echo.
echo ========================================
echo    INSTALACION COMPLETADA
echo ========================================
echo.
pause
