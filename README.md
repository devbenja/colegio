# 🏫 Sistema de Gestión Escolar - Backend

Backend completo para sistema de gestión escolar desarrollado con Node.js, Express, PostgreSQL (Supabase) y Sequelize.

## 🚀 Características

- **Autenticación JWT** con registro y login
- **Sistema de roles** (estudiante, profesor, admin)
- **Autorización basada en roles** con middleware
- **Base de datos PostgreSQL** con Sequelize ORM
- **Validación de datos** con express-validator
- **Estructura organizada** por capas (controladores, servicios, modelos)
- **Seguridad** con helmet y bcrypt

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos (Supabase)
- **Sequelize** - ORM para Node.js
- **JWT** - Autenticación stateless
- **bcryptjs** - Hash de contraseñas
- **express-validator** - Validación de datos

## 📁 Estructura del Proyecto

```
src/
├── config/          # Configuraciones
│   ├── database.js  # Configuración de Sequelize
│   └── config.js    # Configuración general
├── controllers/     # Controladores
│   ├── authController.js
│   └── testController.js
├── lib/            # Librerías
│   └── jwt.js      # Servicio JWT
├── middleware/     # Middlewares
│   └── auth.js     # Autenticación y autorización
├── models/         # Modelos Sequelize
│   └── User.js     # Modelo de usuario
├── routes/         # Rutas de la API
│   ├── authRoutes.js
│   └── testRoutes.js
├── schemas/        # Esquemas de validación
│   └── authSchemas.js
├── services/       # Lógica de negocio
│   └── authService.js
└── app.js          # Archivo principal
```

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd colegio
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar `.env` con tus credenciales de Supabase:
   ```env
   DB_URL=postgresql://postgres:tu_password@db.supabase.co:5432/postgres
   JWT_SECRET=tu_secreto_jwt_super_seguro
   PORT=3000
   ```

4. **Ejecutar el servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## 📡 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

- **POST** `/register` - Registro de usuarios
- **POST** `/login` - Inicio de sesión
- **GET** `/profile` - Perfil del usuario autenticado

### 🧪 Pruebas (`/api/test`)

- **GET** `/estudiante` - Solo estudiantes
- **GET** `/profesor` - Solo profesores  
- **GET** `/admin` - Solo administradores
- **GET** `/multi-role` - Estudiantes, profesores y administradores

## 📝 Ejemplos de Uso

### Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "estudiante@colegio.com",
    "password": "123456",
    "nombre": "Juan",
    "apellido": "Pérez",
    "role": "estudiante"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "estudiante@colegio.com",
    "password": "123456"
  }'
```

### Acceso a Ruta Protegida
```bash
curl -X GET http://localhost:3000/api/test/estudiante \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

## 🔒 Roles y Permisos

- **Estudiante**: Acceso básico a recursos de estudiante
- **Profesor**: Acceso a recursos de profesor + recursos de estudiante
- **Admin**: Acceso completo a todos los recursos

## 🚀 Próximos Pasos

- [ ] Implementar gestión de materias
- [ ] Sistema de calificaciones
- [ ] Gestión de horarios
- [ ] Notificaciones
- [ ] Reportes y estadísticas

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado para el Sistema de Gestión Escolar