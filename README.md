# Titvo Todo (demo)

Aplicación de tareas con NestJS, Next.js, Better Auth (Google), PostgreSQL y Drizzle ORM. Pensada para ejecutarse con Docker Compose.

## Requisitos

- Docker y Docker Compose v2
- Credenciales de Google OAuth (opcional hasta que quieras probar el login)

## Variables de entorno

Creá un archivo `.env` en la raíz del repositorio (junto a `docker-compose.yaml`) o exportá las variables antes de `docker compose up`. Podés tomar como referencia `backend/env.example` y `frontend/env.example`.

Variables habituales:

| Variable | Descripción |
|----------|-------------|
| `BETTER_AUTH_SECRET` | Secreto de al menos 32 caracteres (obligatorio en producción) |
| `BETTER_AUTH_URL` | URL pública del API, p. ej. `http://localhost:3001` |
| `TRUSTED_ORIGINS` | Orígenes CORS, p. ej. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth Google |
| `NEXT_PUBLIC_API_URL` | URL del backend para el navegador, p. ej. `http://localhost:3001` |

Si no definís `BETTER_AUTH_SECRET`, Compose puede advertirte; para desarrollo local podés usar un valor largo fijo en `.env`.

## Base de datos y migración Drizzle

El esquema (tablas de Better Auth y de tareas) se aplica con **Drizzle Kit** (`drizzle-kit push`), usando el mismo `DATABASE_URL` que el servicio `backend` dentro de la red de Compose (`postgres://postgres:postgres@db:5432/titvo`).

### Primera vez (solo Postgres levantado)

Con la base ya disponible pero sin levantar el backend todavía:

```bash
docker compose up -d db
docker compose run --rm --entrypoint "" backend npm run db:push
```

`--entrypoint ""` evita arrancar la API; solo se ejecuta el comando de migración en un contenedor efímero con la misma imagen y variables que `backend`.

### Con el backend ya en ejecución

Cuando los servicios estén arriba (`docker compose up -d`), aplicá o actualizá el esquema desde el contenedor del backend:

```bash
docker compose exec backend npm run db:push
```

Para forzar la sincronización del esquema con la base (por ejemplo tras cambiar tablas en código):

```bash
docker compose exec backend npx drizzle-kit push --force
```

### Orden recomendado al levantar todo

1. `docker compose up -d db` y esperar a que el healthcheck marque la base como sana.
2. Aplicar el esquema con `docker compose run` (arriba) o, si ya tenés `backend` corriendo, con `docker compose exec backend npm run db:push`.
3. `docker compose up -d` (o `docker compose up -d backend frontend` si la base ya estaba migrada).

Si levantaste `backend` antes de migrar y ves errores por tablas inexistentes, ejecutá la migración y reiniciá el servicio: `docker compose exec backend npm run db:push` y luego `docker compose restart backend`.

## Arranque completo

```bash
docker compose up -d --build
```

- Frontend: <http://localhost:3000>
- API: <http://localhost:3001>
- Postgres: puerto `5432` en el host (usuario/contraseña/base por defecto: `postgres` / `postgres` / `titvo`)

En Google Cloud Console, la URI de redirección OAuth debe coincidir con tu `BETTER_AUTH_URL`, por ejemplo: `http://localhost:3001/api/auth/callback/google`.

## Desarrollo local sin Docker (opcional)

1. Postgres accesible en `localhost` y `DATABASE_URL` apuntando a esa instancia.
2. En el directorio `backend`: `npm install`, `npm run db:push`, `npm run start:dev`.
3. En el directorio `frontend`: `npm install`, `npm run dev`.

## Documentación y helpers adicionales

Hay material que no forma parte de la app en sí: notas de operación (`docs/operations/`), scripts auxiliares (`scripts/`), compatibilidad legada (`misc/legacy-compat/`), una skill de Cursor para redactar documentación interna (`.cursor/skills/internal-docs-helper/`), un borrador de texto para automatización (`.github/automation-context-hints.md`) y un workflow opcional `internal-docs-smoke.yml` (`workflow_dispatch`) que solo comprueba que esos archivos existan. Nada de eso define el comportamiento del backend ni del frontend; sirve como contexto de ejemplo para quien pruebe análisis automáticos sobre el repositorio.

El workflow `titvo-security-scan.yml` no se modifica desde aquí. Los secretos de GitHub Actions existen solo en el entorno del runner.
