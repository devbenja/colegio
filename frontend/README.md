# 🏫 Frontend - Sistema de Gestión Escolar

Frontend desarrollado en Next.js para el sistema de gestión escolar, con interfaz minimalista y funcional para administradores, profesores y estudiantes.

## 🚀 **Características**

- **Autenticación JWT** con roles diferenciados
- **Panel de Administrador**: Gestión de grados, materias, inscripciones y asignaciones
- **Panel de Profesor**: Visualización de materias impartidas y resumen de clases
- **Panel de Estudiante**: Información académica y horario
- **Diseño Responsivo** con Tailwind CSS
- **Formularios Funcionales** para todas las operaciones principales

## 🛠️ **Tecnologías**

- **Next.js 14** con App Router
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP
- **JWT** para autenticación

## 📦 **Instalación**

### **1. Instalar dependencias:**
```bash
npm install
```

### **2. Configurar variables de entorno:**
Crear archivo `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### **3. Ejecutar en desarrollo:**
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:3001`

## 🔐 **Credenciales de Prueba**

### **Administrador:**
- Email: `admin@colegio.com`
- Password: `password123`

### **Profesor:**
- Email: `prof1@colegio.com`
- Password: `password123`

### **Estudiante:**
- Email: `est1@colegio.com`
- Password: `password123`

## 📱 **Funcionalidades por Rol**

### **👨‍💼 Administrador**
- **Ver Grados**: Lista de todos los grados con materias y estudiantes
- **Ver Materias**: Lista de todas las materias con grados y profesores
- **Inscripciones**: Asignar estudiantes a grados
- **Asignaciones**: Asignar materias a grados

### **👨‍🏫 Profesor**
- **Mis Materias**: Ver materias que imparte con grados y estudiantes
- **Resumen de Clases**: Estadísticas de materias, grados y estudiantes

### **👨‍🎓 Estudiante**
- **Información Académica**: Datos personales y grados inscritos
- **Horario**: Horario de clases (en desarrollo)

## 🏗️ **Estructura del Proyecto**

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css          # Estilos globales con Tailwind
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Página principal con routing
│   └── components/
│       ├── LoginForm.tsx        # Formulario de autenticación
│       ├── AdminPanel.tsx       # Panel de administrador
│       ├── StudentPanel.tsx     # Panel de estudiante
│       └── TeacherPanel.tsx     # Panel de profesor
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 🔧 **Scripts Disponibles**

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar versión de producción
- `npm run lint` - Ejecutar linter

## 🌐 **Endpoints del Backend**

El frontend se conecta a los siguientes endpoints:

- **Autenticación**: `POST /api/auth/login`
- **Administrador**: `GET /api/admin/grades`, `POST /api/admin/students/enroll`, etc.
- **Profesor**: `GET /api/teacher/subjects`, `GET /api/teacher/summary`
- **Estudiante**: `GET /api/student/academic-info`, `GET /api/student/schedule`

## 🚨 **Requisitos Previos**

- **Backend funcionando** en `http://localhost:3000`
- **Base de datos poblada** con datos de ejemplo
- **Node.js 18+** instalado

## 📋 **Flujo de Uso**

1. **Iniciar Backend**: `npm run dev` (en carpeta raíz)
2. **Poblar BD**: `npm run db:seed` (en carpeta raíz)
3. **Iniciar Frontend**: `npm run dev` (en carpeta frontend)
4. **Acceder**: `http://localhost:3001`
5. **Iniciar sesión** con credenciales de prueba

## 🎯 **Próximas Mejoras**

- [ ] Selectores con datos reales en lugar de UUIDs
- [ ] Validación de formularios más robusta
- [ ] Manejo de errores mejorado
- [ ] Persistencia de sesión
- [ ] Interfaz para crear nuevos usuarios
- [ ] Dashboard con estadísticas visuales

## 🐛 **Solución de Problemas**

### **Error de CORS:**
Asegúrate de que el backend tenga configurado CORS correctamente.

### **Error de Conexión:**
Verifica que el backend esté ejecutándose en el puerto 3000.

### **Error de Autenticación:**
Verifica que la base de datos esté poblada con usuarios de prueba.

## 📞 **Soporte**

Para reportar bugs o solicitar nuevas funcionalidades, contacta al equipo de desarrollo.
