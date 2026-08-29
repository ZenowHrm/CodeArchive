# React + Vite

Este repositorio es una plantilla mínima para una aplicación React creada con Vite.
A continuación se explica cómo instalar, ejecutar en desarrollo, generar el build de producción y desplegarla.

## Requisitos

- Node.js 16 o superior (se recomienda Node 18+).
- npm, yarn o pnpm (cualquiera sirve; los comandos abajo muestran npm como ejemplo).

## Instalación

1. Clonar el repositorio (o descargar y descomprimir):

   git clone <URL-del-repo>
   cd <nombre-del-repo>

2. Instalar dependencias:

   npm install

   (Si usas yarn: `yarn` — si usas pnpm: `pnpm install`)

## Ejecutar en modo desarrollo (levantar el proyecto)

Para iniciar el servidor de desarrollo con hot-reload (Vite):

   npm run dev

Esto abrirá Vite en http://localhost:5173 (por defecto). Si el puerto 5173 está ocupado, Vite elegirá otro puerto y lo mostrará en la consola.

## Generar y probar el build de producción

1. Crear el build:

   npm run build

2. Probar el build localmente (preview):

   npm run preview

El comando `preview` sirve los archivos estáticos generados en `dist/` y emula el entorno de producción a nivel de servidor estático.

## Variables de entorno

- Colocar variables de entorno para Vite en archivos `.env` en la raíz del proyecto.
- Prefijo obligatorio: `VITE_` para que las variables estén disponibles en el código cliente (por ejemplo: `VITE_API_URL=https://api.example.com`).

Ejemplos:

  .env
  VITE_API_URL=https://api.example.com

No comitear secretos en el repositorio.

## Solución de problemas comunes

- Error: Node versión no compatible → instalar Node 16+.
- Dependencias fallan al instalar → borrar `node_modules` y el lockfile (`package-lock.json`/`yarn.lock`/`pnpm-lock.yaml`) y volver a instalar.
- Puerto ocupado → Vite mostrará en consola otro puerto; cerrarlo o especificar uno con `--port`:

  npm run dev -- --port 3000

---