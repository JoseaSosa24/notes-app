
# 🚀 Notes App - Aplicación de Notas Fullstack

Una aplicación moderna de gestión de notas personales construida con Node.js, Express.js, MongoDB y Next.js 15.

## 📋 Estructura del Proyecto

```
notes-app/
├── backend/          # API Node.js + Express.js
├── frontend/         # Aplicación Next.js 15
└── package.json      # Scripts principales
```

## 🔧 Requisitos Previos

### 1. Instalar Bun (Requerido)

**Método 1 - Instalación directa (recomendado):**
```bash
# Windows (PowerShell)
irm bun.sh/install.ps1 | iex

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

**Método 2 - Si ya tienes npm/yarn instalado:**
```bash
# Con npm
npm install -g bun

# Con yarn  
yarn global add bun

# Verificar instalación
bun --version
```

### 2. MongoDB

**¡SIMPLE!** MongoDB se instala automáticamente con `bun install` en el backend.

**Opciones:**
- **Local**: Instalar MongoDB Community Server desde https://mongodb.com
- **Compass (Opcional)**: Para ver datos visualmente

**¿Qué pasa cuando ejecutas el proyecto?**
- Se crea automáticamente una base de datos llamada `notesapp`
- Con dos colecciones: `users` y `notes`
- Todo funciona sin configuración extra

## ⚡ Instalación del Proyecto

### 1. Clonar y entrar al proyecto
```bash
git clone https://github.com/JoseaSosa24/notes-app.git
cd notes-app
```

### 2. Instalar dependencias

**Todo el proyecto usa Bun:**
```bash
# Raíz del proyecto
bun install

# Backend
cd backend && bun install

# Frontend  
cd ../frontend && bun install

# Volver a raíz
cd ..
```

### 3. Variables de entorno

**Backend** - Crear `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=tu-clave-secreta-jwt
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Google OAuth (te enviaré por correo)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

**Frontend** - Crear `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-google-client-id
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-nextauth-secret
```

## 🚀 Ejecutar el Proyecto

### Opción 1: Todo junto (Recomendado)
```bash
# Desde la raíz - inicia backend y frontend
bun dev
```

### Opción 2: Por separado
```bash
# Terminal 1 - Backend
bun dev:backend

# Terminal 2 - Frontend  
bun dev:frontend
```

## 🌐 URLs

- **Aplicación**: http://localhost:3000
- **API**: http://localhost:5000/api
- **Puerto fijo para Google OAuth**: 3000 (no cambiar)

## 🗄️ Base de Datos

### MongoDB Local
- Instalar MongoDB Community Server
- El backend se conecta automáticamente a `mongodb://localhost:27017/notesapp`
- Se crean las colecciones `users` y `notes` automáticamente

### MongoDB Atlas (Nube)
1. Crear cuenta en https://mongodb.com/atlas
2. Crear cluster gratuito
3. Copiar connection string
4. Reemplazar en `MONGODB_URI`

### MongoDB Compass (Opcional)

**Para ver los datos visualmente:**

#### 1. Instalar MongoDB Compass
- Descargar desde: https://www.mongodb.com/products/compass
- O se instala automáticamente con MongoDB Community Server

#### 2. Conectar a MongoDB Local
1. **Abrir MongoDB Compass**
2. **En la pantalla de conexión:**
   - URI: `mongodb://localhost:27017`
   - O llenar manualmente:
     - **Hostname**: `localhost`
     - **Port**: `27017`
     - **Authentication**: None
3. **Click en "Connect"**
4. **¡Listo!** Verás tu servidor MongoDB

#### 3. Ver la Base de Datos
- Una vez conectado, verás la base de datos `notesapp`
- Con las colecciones `users` y `notes`
- Podrás explorar, agregar, editar y eliminar datos visualmente

#### 4. Para MongoDB Atlas (Nube)
- Copiar el connection string completo desde Atlas
- Pegarlo en "New Connection" en Compass
- Conectar igual que arriba

## ✅ ¡Todo Funciona Perfectamente!

**Este proyecto está 100% completo y funcional:**

### 🔐 Autenticación
- **Registro**: Crear cuenta nueva con email/password
- **Login**: Iniciar sesión segura con JWT
- **Protección**: Solo accedes a tus propias notas

### 📝 Gestión de Notas (CRUD)
- **Crear**: Agregar nuevas notas con título y contenido
- **Leer**: Ver todas tus notas en una grid responsiva
- **Actualizar**: Editar notas existentes
- **Eliminar**: Borrar notas con confirmación

### 🎨 Interfaz de Usuario
- **Modo Oscuro**: Toggle entre tema claro y oscuro
- **Responsive**: Funciona perfecto en móvil, tablet y desktop
- **Moderno**: UI limpia con Tailwind CSS
- **Español**: Toda la interfaz en español

### 🚀 ¿Por qué no incluyo base de datos?

**¡No es necesario!** El proyecto funciona automáticamente:

1. **Instalas** las dependencias con `bun install`
2. **Configuras** las variables de entorno (te las envío por correo)
3. **Ejecutas** con `bun dev`
4. **¡Listo!** Todo funciona inmediatamente

**Para la prueba:**
- Registra un usuario
- Crea algunas notas
- Prueba editar, eliminar, buscar
- Cambia entre modo claro/oscuro
- Todo funcionará perfectamente

El backend y frontend están completamente implementados y funcionando. Solo necesitas las variables de entorno.

## 📧 Variables por Correo

Te enviaré estas variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`  
- `JWT_SECRET`
- `NEXTAUTH_SECRET`

## 🐛 Problemas Comunes

**MongoDB no conecta:**
```bash
# Verificar que está corriendo
mongosh mongodb://localhost:27017
```

**Puerto ocupado:**
```bash
# Encontrar proceso
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Matar proceso
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

**Variables de entorno:**
- Verificar que los archivos `.env` existen
- Reiniciar servidores después de cambios
- No dejar espacios extra en las variables

---

**💡 Nota**: Mantén siempre el puerto 3000 para el frontend ya que Google OAuth está configurado específicamente para ese puerto en desarrollo local.
