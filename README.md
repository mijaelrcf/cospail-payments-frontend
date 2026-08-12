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
├── api/         # Cliente HTTP y funciones de API
├── app/         # Configuración de la app (router, providers)
├── components/  # Componentes de UI reutilizables
├── hooks/       # Custom hooks con React Query
├── pages/       # Páginas de la aplicación
├── store/       # Estado global con Zustand
├── types/       # Interfaces y tipos compartidos
├── index.css
└── main.tsx
```

## Flujo de la aplicación

1. El usuario ingresa **código fijo** y **documento de identidad**
2. Se consulta la deuda del socio vía API (`/Cospail/member-debt-by-document`)
3. Se muestran las deudas pendientes; el usuario selecciona las que desea pagar
4. Se registran las deudas seleccionadas vía API (`/Cospail/payments/initiate`)
5. Se genera un código QR asociado al pago vía API (`/BancoEconomico/generate-qr`)
6. El QR se muestra en pantalla para que el usuario pueda escanearlo y pagar
