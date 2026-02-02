# Contabilidad

Aplicacion web de contabilidad personal con Nuxt 4, Nuxt UI y MongoDB. Incluye
login con correo y contrasena, perfiles por usuario y panel para ingresos/gastos.

## Funcionalidades

- Registro e inicio de sesion (correo + contrasena)
- Perfiles por usuario con seleccion de perfil activo
- Ingresos, gastos, movimientos, categorias y resumenes por perfil
- Exportacion a Excel (gastos y resumen)

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
```

`AUTH_COOKIE_NAME` es opcional.

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

## Notas sobre datos por perfil

Los datos de ingresos/gastos ahora se guardan por perfil activo. Si tienes datos
anteriores sin `profileId`, necesitaras migrarlos a un perfil para verlos.
