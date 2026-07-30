# Cospail Payments Frontend

Frontend de pagos para Cospail. Construido con React 19, TypeScript y Vite.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 8** (bundler/dev server)
- **Tailwind CSS 4** (estilos)
- **TanStack React Query 5** (data fetching/caching)
- **Axios** (HTTP client)
- **React Router 7** (ruteo)
- **Zustand** (estado global)
- **ESLint** (linter)

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

## Build para producción

```bash
npm run build
```

El output se genera en la carpeta `dist/`.

## Preview del build

```bash
npm run preview
```

## Linter

```bash
npm run lint
```

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_BASE_URL` | URL base de la API | `https://localhost:7020/api` |

## Estructura del proyecto

```
src/
├── app/            # Configuración de la app (router, providers)
├── application/    # Casos de uso / lógica de aplicación
├── assets/         # Recursos estáticos (imágenes, SVGs)
├── domain/         # Entidades, reglas de negocio, interfaces
├── infrastructure/ # Implementaciones concretas (API, repositorios)
├── presentation/   # Componentes de UI (páginas, layouts, componentes)
└── shared/         # Utilidades compartidas, tipos, helpers
```
