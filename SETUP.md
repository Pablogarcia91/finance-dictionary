# 🚀 Setup Guide - GitHub & VS Code

Esta guía te ayudará a configurar el proyecto en tu computadora y subirlo a GitHub.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ [Node.js](https://nodejs.org/) (versión 16 o superior)
- ✅ [Git](https://git-scm.com/)
- ✅ [VS Code](https://code.visualstudio.com/)
- ✅ Cuenta de [GitHub](https://github.com/)

Para verificar que tienes todo instalado, abre tu terminal y ejecuta:

```bash
node --version
npm --version
git --version
```

## 🎯 Paso a Paso

### 1. Abrir el Proyecto en VS Code

```bash
# Navega a la carpeta del proyecto
cd financial-dictionary

# Abre VS Code en la carpeta actual
code .
```

### 2. Instalar Dependencias

En la terminal de VS Code (Terminal → New Terminal):

```bash
npm install
```

Esto instalará todas las dependencias necesarias del proyecto.

### 3. Probar el Proyecto Localmente

```bash
npm run dev
```

Tu navegador debería abrirse automáticamente en `http://localhost:3000`. Si no, abre el navegador manualmente y ve a esa dirección.

**¡Si ves tu aplicación funcionando, todo está bien! ✅**

### 4. Configurar Git (Primera Vez)

Si es la primera vez que usas Git, configura tu nombre y email:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### 5. Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com)
2. Haz clic en el botón **"New"** (o **"+"** → **"New repository"**)
3. Nombra tu repositorio: `financial-dictionary`
4. Descripción (opcional): "A bilingual financial dictionary app"
5. Selecciona **Public** o **Private**
6. **NO** marques "Add a README file" (ya tenemos uno)
7. Haz clic en **"Create repository"**

### 6. Subir tu Proyecto a GitHub

Una vez creado el repositorio en GitHub, copia la URL que aparece (algo como: `https://github.com/tu-usuario/financial-dictionary.git`)

En la terminal de VS Code:

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Financial Dictionary app"

# Conectar con tu repositorio de GitHub (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/financial-dictionary.git

# Subir los archivos a GitHub
git branch -M main
git push -u origin main
```

**¡Listo! Tu proyecto ya está en GitHub 🎉**

### 7. Verificar en GitHub

Ve a tu repositorio en GitHub y verifica que todos los archivos estén allí.

## 🔄 Workflow Normal (Después de la Configuración Inicial)

Después de hacer cambios en tu código:

```bash
# Ver qué archivos han cambiado
git status

# Agregar los cambios
git add .

# Crear un commit con un mensaje descriptivo
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

## 🌐 Extensiones Recomendadas para VS Code

Abre VS Code y busca estas extensiones (Ctrl/Cmd + Shift + X):

1. **ES7+ React/Redux/React-Native snippets** - Snippets útiles
2. **Tailwind CSS IntelliSense** - Autocompletado para Tailwind
3. **Prettier - Code formatter** - Formatea tu código automáticamente
4. **GitLens** - Mejores herramientas de Git
5. **Auto Rename Tag** - Renombra tags HTML automáticamente

## 📱 Deploy (Opcional)

### Deploy a Vercel (Recomendado - Gratis y Fácil)

1. Ve a [vercel.com](https://vercel.com) y haz login con GitHub
2. Haz clic en "New Project"
3. Selecciona tu repositorio `financial-dictionary`
4. Haz clic en "Deploy"
5. ¡Espera unos segundos y tendrás tu app en vivo! 🚀

Vercel te dará una URL como: `https://financial-dictionary.vercel.app`

### Deploy a Netlify (Alternativa)

1. Ve a [netlify.com](https://netlify.com) y haz login con GitHub
2. Haz clic en "Add new site" → "Import an existing project"
3. Selecciona GitHub y tu repositorio
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Haz clic en "Deploy"

## 🆘 Problemas Comunes

### Error: "npm not found"
- Instala Node.js desde [nodejs.org](https://nodejs.org/)

### Error: "git not found"
- Instala Git desde [git-scm.com](https://git-scm.com/)

### Puerto 3000 ya está en uso
```bash
# En Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En Mac/Linux
lsof -ti:3000 | xargs kill
```

### Los cambios no aparecen en GitHub
```bash
# Verifica que estés en la rama correcta
git branch

# Verifica la conexión con GitHub
git remote -v

# Intenta push de nuevo
git push origin main
```

## 📚 Recursos Adicionales

- [Documentación de React](https://react.dev)
- [Documentación de Vite](https://vitejs.dev)
- [Documentación de Tailwind CSS](https://tailwindcss.com)
- [Guía de Git](https://git-scm.com/book/en/v2)
- [GitHub Docs](https://docs.github.com)

## 💡 Tips

- Haz commits frecuentes con mensajes descriptivos
- Usa ramas para nuevas features: `git checkout -b feature/nueva-funcionalidad`
- Prueba tu código antes de hacer push
- Lee los errores con calma, suelen indicar exactamente qué está mal

---

¿Necesitas ayuda? Crea un Issue en GitHub o contacta al desarrollador.

¡Buena suerte con tu proyecto! 🚀✨
