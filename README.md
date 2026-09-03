# Global Invoice Web

Cliente Angular para emitir y consultar facturas Global Invoice.

## Ejecutar

1. Instale dependencias con `pnpm install`.
2. Ejecute `pnpm start`.
3. Abra `http://localhost:4200`.

La aplicación espera la API en `http://localhost:3000`.

## Despliegue en Vercel

1. Importe este repositorio como un proyecto nuevo en Vercel. La configuración de `vercel.json` instala con pnpm y publica `dist/web/browser`.
2. Despliegue primero el repositorio de la API y copie su URL, por ejemplo `https://global-invoice-api.vercel.app`.
3. En `public/assets/runtime-config.js`, cambie la URL por `https://global-invoice-api.vercel.app/api`, haga commit y vuelva a desplegar este repositorio.

El panel se actualiza cada 15 segundos para ser compatible con Functions de Vercel.
