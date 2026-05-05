# Agent Instructions — Pasadita POS

Compact guidance for OpenCode sessions. If a fact is obvious from filenames, it is omitted.

## Tech Stack
- React 19 + Vite 7 + React Router v7
- Redux Toolkit (global state)
- Material-UI (MUI) v7 + MUI X DataGrid v8
- Axios for HTTP
- No test suite exists; do not create or suggest tests unless explicitly asked

## Development Commands
```bash
pnpm dev      # Vite dev server (host 0.0.0.0, port 5173)
pnpm build    # Production build (esnext, no sourcemaps, manual chunks)
pnpm lint     # ESLint only
pnpm preview  # Preview production build
```
There is no test runner or type-check script.

## Architecture — Strict 3-Layer Pattern
Every domain MUST follow this separation. Never mix business logic into UI components.

1. **API Layer** — `src/apis/{domain}Api.js`
   - Axios instance with `baseURL: import.meta.env.VITE_API_BASE_URL`
   - Request interceptor injects JWT from `sessionStorage.getItem("token")`
2. **Service Layer** — `src/services/{domain}Service.js`
   - Business logic, CRUD wrappers, domain-specific lookups
3. **Hook Layer** — `src/hooks/{domain}/use{Domain}.js`
   - React hooks that compose services with Redux dispatch

### Domain Entities (Redux slices)
`auth`, `user`, `product`, `customer`, `customerType`, `customerFiscalData`, `sale`, `invoice`, `deliveryOrder`, `dashboard`

Register any new slice in `src/stores/store.js`.

## Routing & Authorization
- Two-level routing:
  - `src/AppRoutes.jsx` — top-level auth gating (unauthenticated → `/login`)
  - `src/routes/FruitRoute.jsx` — main app routes inside `Sidebar` layout
- Route guards:
  - `AdminRoute` — `ROLE_ADMIN` only (users, products, customers, customer types, customer fiscal data)
  - `ProtectedRoute` — any authenticated user (sales, delivery, invoices, tickets)
- Multi-word domains use kebab-case in URLs: `customerFiscalData` → `/customer-fiscal-data`
- Non-admin users (`CAJERO`, `PEDIDOS`) get `hasLimitedAccess` and a reduced sidebar menu; redirect after login is `/sale/register`

## API & Environment
- Dev backend: `.env` → `VITE_API_BASE_URL=http://localhost:8080`
- Prod backend: `.env.production` → `https://api.lapasadita.app`
- Scale hardware proxy (Vite only): `/api/scale` → `http://localhost:8081`
- All API errors MUST go through `useApiErrorHandler` (Spanish toasts, auto-logout on 401)

## Domain-Specific Rules

### Invoice (NOT CRUD)
- Invoices are stamped from existing paid sales, not created via form.
- Endpoints: `GET /` (paginated), `POST /timbrar`, `DELETE /{id}?motive=02`, `GET /sale/{saleId}/pdf|xml` (blob), `POST /sale/{saleId}/email?email=...`
- `status` values: `PENDIENTE | TIMBRADA | CANCELADA | ERROR`
- PDF/XML/email actions only enabled when `status === 'TIMBRADA'`
- Cancel button is admin-only.
- Hot-stamp at checkout: `useSaleForm` chains `handleTimbrarInvoice` after `handleSaveSale`; stamping/email failures must never block the committed sale.

### Customer Fiscal Data (CFDI 4.0)
- Independent entity; no FK to `customer`.
- Backend supports `getAll`, `getById`, `getByRfc/{rfc}`, `save`, `update`. **No delete, no change-status.**
- Forms use MUI Grid v2 (`size={{xs,sm,md}}`), NOT Bootstrap.

### Sale / Delivery
- `useSaleForm` is a complex hook managing cart state, customer discounts, product search, delivery order integration, and hot-stamp invoicing.
- Operation types: `'venta'` (sale) or `'pedido'` (delivery order).
- Tickets: `src/utils/printTicket.jsx` + `src/components/sale/Ticket.jsx` (80mm thermal width).

## Component & File Conventions
- Table component: `src/components/{domain}/{Domain}Table.jsx`
- Table hook (debounced search + DataGrid columns): `src/hooks/{domain}/use{Domain}Table.jsx`
- Form component: `src/components/{domain}/{Domain}Form.jsx`
- Page components: `src/pages/{domain}/`
- MUI `sx` style objects: `src/styles/js/`
- Legacy CSS: `src/styles/css/`

## Adding a New Domain Entity
Follow this exact order:
1. `src/apis/{domain}Api.js`
2. `src/services/{domain}Service.js`
3. `src/stores/slices/{domain}/{domain}Slice.js`
4. Register slice in `src/stores/store.js`
5. `src/hooks/{domain}/use{Domain}.js`
6. `src/hooks/{domain}/use{Domain}Table.jsx`
7. `src/components/{domain}/` (Table + Form)
8. `src/pages/{domain}/` (list + register/edit pages)
9. Add routes to `src/routes/FruitRoute.jsx`
10. Add sidebar entry in `src/components/layout/Sidebar.jsx`

## Design & Styling
- UI components MUST use MUI.
- Follow the `frontend-design` skill rules at `.agents/skills/frontend-design` when working on any UI or styling.
- `customerFiscalData` forms use MUI Grid v2; older forms may still use Bootstrap — do not refactor legacy forms unless asked.

## Important Constraints
- Never bypass the 3-layer architecture.
- Always use `useApiErrorHandler` for API interactions.
- Do not generate test files.
- Do not run `git commit`, `git push`, or other git mutations unless explicitly asked.
