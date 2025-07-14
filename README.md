# 📝 Personal Notes Manager - Fullstack App

A modern, fullstack personal notes management application built with Node.js, Express.js, MongoDB, and Next.js 15+.


```

# 🚀 Guía de Instalación - Notes App

## 📋 Estructura del Proyecto

```
notes-app/
├── backend/          # API Node.js + Express.js
├── frontend/         # Aplicación Next.js 15
└── package.json      # Scripts principales
```

## 📋 Requisitos Previos

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

**¡IMPORTANTE!** MongoDB se instala automáticamente con `bun install` en el backend.

**Opciones:**
- **Local**: Solo instalar MongoDB Community Server desde https://mongodb.com
- **Nube**: Crear cuenta gratuita en MongoDB Atlas (más fácil)
- **Compass**: Instalar MongoDB Compass para ver datos visualmente (opcional)

## 🔧 Instalación del Proyecto

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

## ⚡ Ejecutar el Proyecto

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
```bash
# Iniciar (si instalaste local)
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### MongoDB Atlas (Nube)
1. Crear cuenta en https://mongodb.com/atlas
2. Crear cluster gratuito
3. Copiar connection string
4. Reemplazar en `MONGODB_URI`

### MongoDB Compass (Opcional)
- Interfaz gráfica para ver/gestionar datos
- Conectar a: `mongodb://localhost:27017` (local) o tu Atlas string

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
taskkill /PID