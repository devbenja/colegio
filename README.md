# 🏫 Sistema de Gestión Escolar - Backend

Backend completo para un sistema de gestión escolar que maneja estudiantes, profesores, grados, materias y asignaciones.

## 🚀 Características

- **Autenticación JWT** con cookies seguras
- **Sistema de roles**: Admin, Profesor, Estudiante
- **Gestión de grados** (1° a 6° de secundaria)
- **Gestión de materias** con asignaciones
- **Asignación de profesores** a materias
- **Inscripción de estudiantes** a grados
- **API RESTful** con validaciones
- **Base de datos PostgreSQL** con Sequelize
- **Módulos ES6** (import/export)

## 🏗️ Arquitectura del Sistema

### Usuarios y Roles
- **Administrador**: Gestiona todo el sistema
- **Profesores**: Imparten materias específicas
- **Estudiantes**: Pertenecen a grados y cursan materias

### Estructura de Datos
```
Grados (1° a 6°) ←→ Materias ←→ Profesores
    ↓
Estudiantes (inscritos en grados)
```

### Relaciones
- Un **Grado** puede tener muchas **Materias**
- Una **Materia** puede ser impartida por muchos **Profesores**
- Un **Estudiante** puede estar en un **Grado**
- Un **Profesor** puede enseñar múltiples **Materias**

## 📋 Requisitos Previos

- Node.js 16+
- PostgreSQL 12+
- npm o yarn

## 🛠️ Instalación

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
# Copiar el archivo de ejemplo
cp env.example .env

# Editar .env con tus credenciales
DB_HOST=localhost
DB_PORT=5432
DB_NAME=colegio_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_URL=postgresql://postgres:tu_contraseña@localhost:5432/colegio_db
JWT_SECRET=tu_secreto_jwt_muy_seguro
```

4. **Crear la base de datos**
```sql
CREATE DATABASE colegio_db;
```

5. **Ejecutar migraciones y seed**
```bash
# Probar conexión
npm run db:test

# Poblar con datos de ejemplo
npm run db:seed
```

6. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🗄️ Estructura de la Base de Datos

### Tablas Principales
- **users**: Usuarios del sistema (admin, profesores, estudiantes)
- **grades**: Grados escolares (1° a 6°)
- **subjects**: Materias académicas
- **grade_subjects**: Relación entre grados y materias
- **teacher_subjects**: Asignación de profesores a materias
- **student_grades**: Inscripción de estudiantes en grados

## 🔐 Endpoints de la API

### Autenticación (`/api/auth`)
- `POST /register` - Registro de usuarios
- `POST /login` - Inicio de sesión
- `GET /profile` - Perfil del usuario autenticado
- `POST /logout` - Cerrar sesión

### Administración (`/api/admin`) - Solo Admin
- `GET /grades` - Obtener todos los grados con materias y estudiantes
- `GET /subjects` - Obtener todas las materias con grados y profesores
- `POST /grades/assign-subject` - Asignar materia a un grado
- `POST /teachers/assign-subject` - Asignar materia a un profesor
- `POST /students/enroll` - Inscribir estudiante en un grado
- `GET /students/:id` - Información completa de un estudiante

### Estudiantes (`/api/student`) - Solo Estudiantes
- `GET /academic-info` - Información académica del estudiante
- `GET /schedule` - Horario del estudiante

### Profesores (`/api/teacher`) - Solo Profesores
- `GET /subjects` - Materias que imparte el profesor
- `GET /subjects/:id/students` - Estudiantes de una materia específica
- `GET /summary` - Resumen de clases del profesor

### Pruebas (`/api/test`)
- `GET /estudiante` - Ruta de prueba para estudiantes
- `GET /profesor` - Ruta de prueba para profesores
- `GET /admin` - Ruta de prueba para administradores
- `GET /multi-role` - Ruta para múltiples roles

## 👥 Usuarios de Ejemplo

Después de ejecutar `npm run db:seed`, tendrás:

### Administrador
- **Email**: admin@colegio.com
- **Password**: password123

### Profesores
- **Email**: prof1@colegio.com, prof2@colegio.com
- **Password**: password123

### Estudiantes
- **Email**: est1@colegio.com a est10@colegio.com
- **Password**: password123

## 🔧 Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar servidor en desarrollo con nodemon
npm run db:test    # Probar conexión a la base de datos
npm run db:seed    # Poblar base de datos con datos de ejemplo
```

## 🏗️ Estructura del Proyecto

```
src/
├── config/           # Configuración de BD y asociaciones
├── controllers/      # Lógica de negocio
├── middleware/       # Middlewares de autenticación
├── models/          # Modelos de Sequelize
├── routes/          # Definición de rutas
├── schemas/         # Validaciones de entrada
├── services/        # Servicios de autenticación
└── app.js           # Archivo principal
```

## 🔒 Seguridad

- **JWT** para autenticación
- **Cookies HTTP-only** para tokens
- **Validación de entrada** con express-validator
- **Middleware de autorización** por roles
- **Helmet** para headers de seguridad
- **CORS** configurado

## 🧪 Pruebas

```bash
# Probar conexión a la BD
npm run db:test

# Probar endpoints (con Postman o similar)
# 1. Registrar usuario: POST /api/auth/register
# 2. Login: POST /api/auth/login
# 3. Usar token en endpoints protegidos
```

## 📝 Ejemplo de Uso

### 1. Registrar un estudiante
```bash
POST /api/auth/register
{
  "email": "nuevo@estudiante.com",
  "password": "123456",
  "nombre": "Juan",
  "apellido": "Pérez",
  "role": "estudiante"
}
```

### 2. Login
```bash
POST /api/auth/login
{
  "email": "nuevo@estudiante.com",
  "password": "123456"
}
```

### 3. Obtener información académica (como estudiante)
```bash
GET /api/student/academic-info
Authorization: Bearer <token>
```

## 🚀 Despliegue

1. **Configurar variables de producción**
2. **Cambiar NODE_ENV a 'production'**
3. **Configurar CORS_ORIGIN con tu dominio**
4. **Usar PM2 o similar para gestión de procesos**

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles

## 🆘 Soporte

Para soporte técnico o preguntas:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo

---

**Desarrollado con ❤️ para la gestión escolar moderna**