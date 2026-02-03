# Contabilidad

Aplicacion web de contabilidad personal con Nuxt 4, Nuxt UI y MongoDB. Incluye
login con correo y contrasena y panel para ingresos/gastos.

## Funcionalidades

- Registro e inicio de sesion (correo + contrasena)
- Ingresos, gastos, movimientos, categorias y resumenes
- Exportacion a Excel (gastos y resumen)
- Envio de correos con Resend (opcional)

## Requisitos

- Node.js 20+
- Bun 1.3+
- MongoDB (URI de conexion)

## Configuracion

Crea un archivo `.env` con:

```env
MONGO_URI=tu_uri_de_mongodb
AUTH_SECRET=una_clave_larga_y_segura
AUTH_COOKIE_NAME=contabilidad_auth
RESEND_API_KEY=tu_api_key_de_resend
RESEND_FROM="Contabilidad <no-reply@tu-dominio.com>"
```

`AUTH_COOKIE_NAME` es opcional. `RESEND_API_KEY` y `RESEND_FROM` son necesarios
solo si vas a usar el envio de correos.

## Instalar dependencias

```bash
bun install
```

## Desarrollo

```bash
bun run dev
```

## Lint y types

```bash
bun run lint
bun run typecheck
```

## Produccion

```bash
bun run build
bun run preview
```

## Deploy en Vercel

1. Sube el repo a GitHub.
2. En Vercel crea un nuevo proyecto y conecta el repo.
3. Configura variables de entorno:
   - `MONGO_URI`
   - `AUTH_SECRET`
   - `AUTH_COOKIE_NAME` (opcional)
4. Asegurate de que el build use `bun`.

## Notas

El envio de correos se realiza desde `server/api/emails/send.post.ts`.
