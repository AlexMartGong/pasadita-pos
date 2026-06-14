# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## AI Assistant Guidelines

**Role:** You are a Senior Frontend Developer specializing in React, Vite, and Redux Toolkit. You strictly adhere to SOLID principles, clean code practices, and the established architectural patterns of this repository.

**Context:** You are working on a Point of Sale (POS) system that utilizes a strict three-layer architecture (API, Service, Hook) for each domain. State management is handled globally by Redux Toolkit.

**Exact Task:** When asked to create, modify, or debug features, you must first analyze the request, identify the affected domains, and implement the solution following the exact steps outlined in the "Adding New Features" section. Always ask for clarification if the requirements conflict with the existing architecture.

**Constraints & Rules:**
1. **Architecture:** Strictly respect the 3-layer pattern (`apis/`, `services/`, and `hooks/`). Do not bypass layers or mix business logic directly inside UI components.
2. **SOLID Principles:** Keep components small, ensure single responsibility (especially for custom hooks), and write maintainable, self-documenting code.
3. **UI & Styling:** UI components must use Material-UI (MUI) and adhere to the project's existing styling patterns.
4. **Error Handling:** Always use the centralized `useApiErrorHandler` hook for API interactions.
5. **Testing:** Currently, there is no test suite. Do not generate or suggest test files unless explicitly requested by the user.
6. **Design Guidelines:** Whenever working on UI components or styling, you must strictly follow the rules defined in the `frontend-design` skill located at `.claude/skills/frontend-design`.

**Output Format:**
- Provide complete, functional code blocks. Avoid skipping logic with comments like `// rest of the code`.
- Briefly explain the architectural reasoning behind your implementation.
- Provide a clear list of the files that need to be created or modified.
## Project Overview

A Point of Sale (POS) system built with React + Vite frontend. The application manages employees, products, customers, customer types, customer fiscal data (CFDI 4.0), sales, delivery orders, and invoices (CFDI 4.0 stamped via Facturapi) with role-based access control. No test suite exists — there are no test files or test runner configured.

> A condensed version of this guidance lives in `AGENTS.md` (for other agent tools). When you change an architectural rule here, update `AGENTS.md` too so the two stay in sync.

## Development Commands

These four scripts are the complete set — there is no test runner and no type-check script.

```bash
# Start development server with HMR (host 0.0.0.0, port 5173)
pnpm dev

# Build for production
pnpm build

# Lint the codebase (ESLint only)
pnpm lint

# Preview production build
pnpm preview
```

## Architecture

### State Management
- **Redux Toolkit** for global state management
- Store location: `src/stores/store.js`
- Slices: `auth`, `user`, `product`, `customer`, `customerType`, `customerFiscalData`, `sale`, `invoice`, `deliveryOrder`, `dashboard`
- Each slice located in `src/stores/slices/{domain}/{domain}Slice.js` — **exception:** `customerType` is nested under `customer/` (`src/stores/slices/customer/customerTypeSlice.js`), and `customerType` has no `src/hooks/customerType/` dir of its own

### API Communication Pattern
Three-layer architecture for each domain (user, product, customer, customerType, customerFiscalData, sale, invoice, deliveryOrder):

1. **API Layer** (`src/apis/{domain}Api.js`):
   - Axios instance with base URL from `VITE_API_BASE_URL` environment variable
   - Request interceptor adds JWT from `sessionStorage.getItem("token")`
   - All API instances follow this pattern

2. **Service Layer** (`src/services/{domain}Service.js`):
   - Business logic and API calls
   - Functions for CRUD operations: `getAll`, `getById`, `save`, `update`, `delete`, `search`
   - Error handling and logging
   - Backend may not expose every CRUD verb (e.g. `customerFiscalData` lacks `delete` and `changeStatus` — service exposes only what the backend supports plus domain-specific lookups like `getByRfc`)
   - Some domains break the CRUD shape entirely (e.g. `invoice` exposes `getAllInvoices` (paginated), `timbrarInvoice`, `cancelInvoice`, `downloadInvoicePdf/Xml` (with `responseType: 'blob'`), `sendInvoiceEmail` instead of save/update/delete)

3. **Hook Layer** (`src/hooks/{domain}/use{Domain}.js`):
   - React hooks that combine services with Redux dispatch
   - Used by components for data operations

### Authentication & Authorization
- Auth lives in `src/auth/` (separate from domain pattern): `hooks/useAuth.js`, `services/authService.js`, `pages/LoginPage.jsx`
- JWT-based authentication; both `login` (JSON) and `token` stored in sessionStorage
- Three user roles: `ROLE_ADMIN`, `ROLE_CAJERO`, `ROLE_PEDIDOS`
- `hasLimitedAccess` flag on auth state for non-admin users (CAJERO/PEDIDOS)
- Login redirects: non-admin → `/sale/register`, admin → `/products/quick-prices` (admin landing changed from `/dashboard`); redirect logic lives in `src/auth/hooks/useAuth.js`, not in `LoginPage.jsx`
- Two-level routing in `src/AppRoutes.jsx`:
  - Unauthenticated users → `/login`
  - Authenticated users → `FruitRoute` (main app routes)
- Route guards:
  - `AdminRoute`: Admin-only routes (user management, products, customers, customer types, customer fiscal data)
  - `ProtectedRoute`: Any authenticated user (sales, delivery, tickets, invoices)

### Routing Structure
- `src/AppRoutes.jsx`: Top-level auth routing
- `src/routes/FruitRoute.jsx`: Main application routes with Sidebar layout
- Pattern: Domain resources use CRUD routes (`/{domain}`, `/{domain}/register`, `/{domain}/edit/:id`)
- Multi-word domains use kebab-case in URLs (e.g. `customerFiscalData` → `/customer-fiscal-data`, `/customer-fiscal-data/register`, `/customer-fiscal-data/edit/:id`)

### Component Organization
- `src/components/layout/`: Layout components (Sidebar)
- `src/components/auth/`: Auth guards (AdminRoute)
- `src/components/common/`: Reusable UI components (StatsCard, StatsCardContainer, ConfirmDialog)
- `src/components/{domain}/`: Domain-specific components
  - `{Domain}Table.jsx`: Data grid/table component
  - `{Domain}Form.jsx`: Create/edit form component
- **Sale register view (`/sale/register`) breaks the table/form pattern** — it is an asymmetric POS layout, not a CRUD form. `SaleForm.jsx` composes `useSaleForm` and renders a MUI Grid v2 split: left ~70% = `ProductCatalog.jsx` (search + responsive grid of `ProductCard.jsx` tiles, replaced the old products table) and right ~30% (see perf note below) = a fixed "ticket" panel (`OperationTypeToggle.jsx` admin-only + `SaleInfo.jsx` + conditional `DeliveryOrder.jsx` + `ShoppingCart.jsx`). `ShoppingCart` is a flex column whose totals + "Cobrar Venta"/"Cancelar" footer stays pinned while the cart list scrolls. Clicking a `ProductCard` opens `AddProductForm.jsx` (quantity + scale via `QuantityInput`, read-only price/total). Reusable `sx` and the per-category color/label/initials helpers for this view live in `src/styles/js/SaleFormStyles.js`.
  - **Catalog performance pattern (preserve this):** the product list can be large (~250 items), so `ProductCatalog` paginates client-side at `ITEMS_PER_PAGE = 20` (slices `filteredProducts` before mapping; MUI `<Pagination>` below the grid; `page` resets to 1 via `useEffect` on `productSearch`). `ProductCard` is wrapped in `React.memo`, kept effective by a referentially stable `onSelect` chain: `useSaleForm.handleSelectProduct` (memoized with `useCallback`) → `SaleForm.handleOpenProductDialog` (`useCallback`) → `ProductCatalog.handleSelect` (`useCallback`). Keep these callbacks stable when editing this view.
- **Quick price-edit view (`/products/quick-prices`, `AdminRoute`, admin post-login landing) also breaks the table pattern** — mobile-first touch UI, not a DataGrid. `ProductPriceEditor.jsx` (composes `useQuickPrices`) renders a responsive MUI Grid v2 (`size={{xs:12, sm:6, md:4, lg:3}}`) of memoized `ProductPriceCard.jsx` tiles, inspired by `ProductCatalog`: sticky search with **300ms debounce** (private `useDebounce` in the hook), client-side `<Pagination>` (`ITEMS_PER_PAGE = 24`). Each card has a `type="number" inputMode="decimal"` price `TextField` with a dynamic `aria-label` ("Precio de {name}") and saves **both** onBlur and via a ≥48px Save button (touch target ≥44px). Reuses the existing data layer — `productService.updateProductPrice` (`PUT /update-price/{id}`, body `{price}`) + `useProduct.handleUpdatePriceProduct` (already routed through `useApiErrorHandler`); **no new API/service/slice**. `useQuickPrices.handleSavePrice` is `useCallback`-stable to keep `ProductPriceCard`'s `React.memo` effective. Reuses `productInitials`/`categoryColor`/`categoryLabel` from `SaleFormStyles.js`; own `sx` in `src/styles/js/QuickPricesStyles.js`. This view **replaced the retired** `SimpleProductTable` + `useProductTableSimple` (old `/product/price-change` route, now removed).

### Custom Hooks
- `useApiErrorHandler`: Centralized error handling with Spanish messages
  - Handles HTTP status codes (400-503)
  - Shows toast notifications via react-toastify
  - Auto-logout on 401 responses
- Domain hooks (`useUser`, `useProduct`, `useCustomer`, `useCustomerType`, `useCustomerFiscalData`, `useSale`, `useInvoice`, `useDeliveryOrder`): Combine service calls with Redux
- **Table hooks** (`use{Domain}Table.jsx`): Each table component has a companion hook that provides debounced search (300ms), filtered data, and MUI DataGrid column configuration
- Special hooks:
  - `useSaleForm`: Complex form hook managing cart state, customer discounts, product search, validation, delivery order integration, and **hot-stamp invoicing** (composes `useCustomerFiscalData` for the fiscal-profile list and `useInvoice` to call `handleTimbrarInvoice` after a successful save, then auto-fires `handleSendInvoiceEmail` fire-and-forget if `fiscalData.emailFacturacion` is populated — email failure never blocks the committed sale). Supports two operation types: `'venta'` (sale) and `'pedido'` (delivery order). Exposes `requiresInvoice`, `selectedFiscalId`, `customerFiscalDataList`, and their setters alongside the cart/customer state.
  - `useScale`: Hardware integration for digital scales with weight reading, connection management, and polling

### Ticket/Printing System
- `src/utils/printTicket.jsx`: `printTicket()` and `previewTicket()` functions
- `src/components/sale/Ticket.jsx`: Ticket layout component (80mm thermal printer width)
- Uses React portals for print rendering
- Distinguishes between "VENTA EN CAJA" and "PEDIDO A DOMICILIO" on tickets
- `TicketPage.jsx` allows viewing and reprinting historical tickets

### Utilities
- `src/utils/formatters.js`: Localized formatting functions
  - `formatCurrency(value)`: Mexican peso (MXN), 0 decimal places
  - `formatDate(dateString)`: Spanish locale (es-ES) with time

### Styling
- CSS files in `src/styles/css/` (Ticket, LoginPage, Sidebar) — legacy/global styles only; new UI uses MUI `sx`
- MUI `sx` style objects in `src/styles/js/` (FormStyles, PageHeader, PageContainer, StatsCards, SidebarStyles, DashboardStyles, SaleFormStyles, etc.) — each exports a named `*Styles` const of plain `sx` objects (some are functions taking params)
- New/refactored UI is MUI-only (`sx`); per the AI guidelines, follow the `frontend-design` skill at `.claude/skills/frontend-design`

### Local Agent (Scale + Station ID)
A per-terminal local agent runs at `http://localhost:8081` and serves **both** the scale and the station identity. It is optional — the app degrades gracefully when the agent is unreachable.
- **Scale** (`src/apis/scaleApi.js`): Vite dev server proxies `/api/scale` → `http://localhost:8081`; endpoints `/connect`, `/disconnect`, `/weight`, `/status`. Driven by the `useScale` hook, used in `QuantityInput` to weigh `KILOGRAMO` products.
- **Station ID** (`src/services/agentService.js`): `getStationId()` fetches `GET /api/station` and caches `stationId` in **localStorage** (key `stationId`); `getCachedStationId()` reads the cache without a network call. Called once on app load in `FruitRoute.jsx`. Unlike auth (`token`/`login` in sessionStorage), the station id lives in localStorage so it persists across sessions on the same physical terminal.
- **Where stationId flows:** attached to every sale payload (`useSaleForm.handleSubmit` sets `stationId: getCachedStationId()`) and passed as a `?stationId=` query param when fetching a ticket (`saleService.getTicketBySaleId(saleId, stationId)`) so the right terminal prints. A null/uncached stationId is tolerated — the param is simply omitted.

### Environment Configuration
- `.env`: `VITE_API_BASE_URL=http://localhost:8080` (development)
- `.env.production`: `VITE_API_BASE_URL=https://api.lapasadita.app` (production)
- Vite build: `esnext` target, manual chunk splitting (vendor, redux, mui), no sourcemaps

### Key Dependencies
- **Core**: React 19 + Vite 7 (no TypeScript — plain JSX/JS, no type-check script)
- **UI**: Material-UI (MUI) v7 with MUI X DataGrid v8, Bootstrap for legacy styles
- **Charts**: Recharts (dashboard visualizations)
- **Routing**: React Router v7
- **State**: Redux Toolkit
- **HTTP**: Axios with interceptors
- **Notifications**: react-toastify
- **Icons**: FontAwesome, MUI Icons

## Adding New Features

When adding a new domain entity:
1. Create API instance in `src/apis/{domain}Api.js`
2. Create service in `src/services/{domain}Service.js`
3. Create Redux slice in `src/stores/slices/{domain}/{domain}Slice.js`
4. Register slice in `src/stores/store.js`
5. Create custom hook in `src/hooks/{domain}/use{Domain}.js`
6. Create table hook in `src/hooks/{domain}/use{Domain}Table.jsx` (with debounced search + DataGrid columns)
7. Create components in `src/components/{domain}/`
8. Create pages in `src/pages/{domain}/`
9. Add routes to `src/routes/FruitRoute.jsx`
10. Add Sidebar entry in `src/components/layout/Sidebar.jsx` (icon + label + path)

## Domain Reference

### customerFiscalData (CFDI 4.0)
- Independent entity (no FK to `customer`); identified by `fiscalId`
- Backend base path: `/api/customer-fiscal-data`
- Available endpoints: `getAll`, `getById`, `getByRfc/{rfc}`, `save`, `update`. **No delete, no change-status.**
- Entity fields: `fiscalId`, `rfc`, `razonSocial`, `regimenFiscal` (3-digit SAT code), `codigoPostalFiscal` (5 digits), `usoCfdi` (3–4 chars), `emailFacturacion`, `phone` (optional), `address` (optional), `active`, `createdAt`
- Frontend route: `/customer-fiscal-data` (under `AdminRoute`)
- Form uses MUI Grid v2 (`size={{xs,sm,md}}` prop), not Bootstrap — break from the older `customer`/`product` form pattern

### invoice (Facturación CFDI 4.0)
- Action-driven domain, **not CRUD**: invoices are not created via form — they are stamped from an existing paid sale.
- Backend base path: `/api/invoices` (Facturapi-backed)
- Available endpoints:
  - `GET /` — paginated list (`?page&size&sort`), returns Spring `Page<InvoiceResponseDto>` (extract `data.content`)
  - `POST /timbrar` — body `{ saleId, fiscalId }`, stamps the CFDI
  - `DELETE /{invoiceId}?motive=02` — cancels (default SAT motive `"02"`)
  - `GET /sale/{saleId}/pdf` and `/xml` — return `byte[]` (use `responseType: 'blob'`)
  - `POST /sale/{saleId}/email?email=foo@bar.com` — email is **query param**, body is `null`
- Entity/response fields: `invoiceId`, `saleId`, `fiscalId`, `rfc`, `razonSocial`, `uuid`, `status`, `xmlUrl`, `pdfUrl`, `createdAt`, `timbradoAt`
- `status` ∈ `PENDIENTE | TIMBRADA | CANCELADA | ERROR`. PDF/XML/email actions require `status === 'TIMBRADA'` — UI disables buttons otherwise.
- Slice state is minimal: `{ invoiceList, loading }` (no `invoiceSelected`; no edit form)
- Hook (`useInvoice`) exposes a special `handleDownloadFile(saleId, type)` that wraps the blob response into `URL.createObjectURL` + temporary `<a download>` to trigger browser download, then `revokeObjectURL`.
- **Frontend route:** `/invoices` under `ProtectedRoute` — accessible to all roles (ADMIN, CAJERO, PEDIDOS). Listed in Sidebar as "Facturas" (`ReceiptLong` icon) in both `fullMenuItems` and `limitedMenuItems`.
- **RBAC in the table:** PDF, XML, and Email buttons visible to all roles. Cancel button rendered only when `state.auth.isAdmin === true` (conditional render in `useInvoiceTable.jsx` columns, reads `isAdmin` via `useSelector`).
- **Email dialog (SendEmailModal):** `src/components/invoice/SendEmailModal.jsx` is an MUI `Dialog` (props `open`, `onClose`, `invoice`). On open it calls `useCustomerFiscalData.handleGetFiscalDataById(invoice.fiscalId)` to prefill `emailInput` with `emailFacturacion`; user can edit before sending. Calls `useInvoice.handleSendInvoiceEmail(saleId, emailInput)` on confirm; closes on success. Uses a `cancelled` flag in the `useEffect` cleanup to avoid setState after unmount. Modal state (`isEmailModalOpen`, `selectedInvoiceForEmail`, `handleCloseEmailModal`) lives in `useInvoiceTable` and is consumed by `InvoiceTable.jsx`. Cancel dialog remains inline in `InvoiceTable.jsx`.
- **Hot-stamp at checkout (timbrado en caliente):** `PaymentModal.jsx` exposes a "Requiere Factura" `Checkbox` + conditional fiscal-profile `Select` populated from `state.customerFiscalData.customerFiscalDataList` (filtered to `active === true`, label `${rfc} - ${razonSocial}`). `useSaleForm.handleSubmit` chains `handleTimbrarInvoice({saleId: result.id, fiscalId: selectedFiscalId})` **after** `handleSaveSale` resolves successfully — non-blocking: a stamping failure must not roll back or block the already-committed sale. If timbrado succeeds and `fiscalData.emailFacturacion` is populated, `handleSendInvoiceEmail` is fired fire-and-forget (`.catch(() => {})`) — email failure never blocks the sale or UI. Save is disabled when `requiresInvoice && !selectedFiscalId`. SAT-rule warning: when `requiresInvoice && total > 2000 && paymentMethodId === 1` (efectivo), render `<Alert severity="warning">` — visual only, never blocks save.
- **A-posteriori stamp from sales history (timbrado manual):** `src/components/sale/InvoiceSaleModal.jsx` is an MUI `Dialog` (props `open`, `onClose`, `saleId`) that fetches the active fiscal list via `useCustomerFiscalData.handleGetAllFiscalData()` on open, lets the admin pick a profile, and calls `useInvoice.handleTimbrarInvoice({saleId, fiscalId})`. Closes on success; uses `loading` from the invoice slice to disable buttons during the request. Triggered from the `ReceiptLong` row-action in `useSaleTable.jsx` (admin-only, alongside Edit/Payment). The modal state (`selectedSaleIdForInvoice`, `isInvoiceModalOpen`, `handleOpenInvoiceModal`, `handleCloseInvoiceModal`) lives in `useSaleTable` and is consumed by `SaleTable.jsx`, which renders `<InvoiceSaleModal/>`. The button is **always enabled** — there is no `invoiced` flag on the `Sale` payload, so a re-stamp attempt is allowed to hit the backend, which rejects with 400 "La venta ya está facturada" and `useApiErrorHandler` toasts the error.