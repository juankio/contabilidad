# Contabilidad

Aplicación web de finanzas personales construida con Nuxt 4, Nuxt UI v3 y MongoDB. Permite gestionar ingresos, gastos, préstamos, planeación de compras y más, con soporte para múltiples perfiles por usuario.

## Funcionalidades

- **Autenticación** — registro e inicio de sesión con correo/contraseña y Google OAuth
- **Dashboard** — balance actual, movimientos recientes y estadísticas con gráficas
- **Movimientos** — ingresos, gastos y transferencias entre perfiles con categorías
- **Gastos** — listado detallado por perfil con filtros y exportación a Excel
- **Préstamos** — seguimiento de préstamos pendientes y pagados con plan de cuotas
- **Planeador de compras** — listas de compras con presupuesto y resumen
- **Reportes** — resumen financiero exportable
- **Perfiles** — múltiples perfiles con colores, íconos y categorías personalizadas
- **Módulos especiales** — catálogo de postres, tienda y granja de cerdos
- **Modo oscuro/claro** — selector de tema integrado
- **Envío de correos** — notificaciones con Resend (opcional)

## Stack

- **Frontend:** Nuxt 4, Vue 3 (Composition API), Nuxt UI v3, Tailwind CSS v4
- **Backend:** Nuxt server routes (Nitro), Mongoose
- **Base de datos:** MongoDB
- **Auth:** JWT + cookies + Google OAuth
- **Deploy:** Vercel

## Requisitos

- Node.js 20+
- Bun 1.3+
- MongoDB (URI de conexión)

## Configuración

Crea un archivo `.env` con:

```env
MONGO_URI=tu_uri_de_mongodb
AUTH_SECRET=una_clave_larga_y_segura
AUTH_COOKIE_NAME=contabilidad_auth

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu_google_client_id

# Resend (opcional, para envío de correos)
RESEND_API_KEY=tu_api_key_de_resend
RESEND_FROM="Contabilidad <no-reply@tu-dominio.com>"
```

`AUTH_COOKIE_NAME` y `GOOGLE_CLIENT_ID` son opcionales. Las variables de Resend solo son necesarias si usas el envío de correos.

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

## Producción

```bash
bun run build
bun run preview
```

## Deploy en Vercel

1. Sube el repo a GitHub.
2. En Vercel crea un nuevo proyecto y conecta el repo.
3. Configura las variables de entorno (`MONGO_URI`, `AUTH_SECRET`, etc.).
4. El preset de Nitro ya está configurado para Vercel (`nitro: { preset: 'vercel' }`).

## Estructura

```
app/
├── components/         # Componentes por módulo (gastos, préstamos, perfiles, etc.)
├── composables/        # Lógica reutilizable
├── layouts/            # Layout principal con navegación
└── pages/              # Rutas: /, /gastos, /prestamos, /planeador, /reportes, /perfil
server/
└── api/                # Endpoints REST (auth, movimientos, gastos, préstamos, etc.)
```
