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
5. **Testing:** A minimal Vitest suite covers **pure utilities only** (`src/utils/__tests__/`: `money`, `paymentPreview`). Do not generate or suggest component/hook tests or new suites unless explicitly requested by the user.
6. **Design Guidelines:** Whenever working on UI components or styling, you must strictly follow the rules defined in the `frontend-design` skill located at `.claude/skills/frontend-design`.

**Output Format:**
- Provide complete, functional code blocks. Avoid skipping logic with comments like `// rest of the code`.
- Briefly explain the architectural reasoning behind your implementation.
- Provide a clear list of the files that need to be created or modified.
## Project Overview

A Point of Sale (POS) system built with React + Vite frontend. The application manages employees, products, customers, customer types, customer fiscal data (CFDI 4.0), sales, delivery orders, customer accounts (partial payments / abonos and credit limits), and invoices (CFDI 4.0 stamped via Facturapi) with role-based access control. Vitest runs only the pure-utility tests in `src/utils/__tests__/`.

> A condensed version of this guidance lives in `AGENTS.md` (for other agent tools). When you change an architectural rule here, update `AGENTS.md` too so the two stay in sync.

## Development Commands

Requires **Node.js ^20.19 or >=22.13** (dev environment runs Node 24 via nvm): Vite 8 needs ^20.19 / >=22.12 and ESLint 10 needs ^20.19 / ^22.13 / >=24. `pnpm build` fails on Node 18 with `ReferenceError: crypto is not defined` (transitive `serialize-javascript` needs the global `crypto`).

These five scripts are the complete set — there is no type-check script. `package.json` pins `"packageManager": "pnpm@10.34.9"` (the pnpm 10 that last wrote `pnpm-lock.yaml`; it regenerates it byte-identical): corepack, and a newer global pnpm via `manage-package-manager-versions`, run that version, which also matches the pnpm 10 store `node_modules` is linked from. Don't let a pnpm 11 reinstall rewrite the lockfile.

```bash
# Start development server with HMR (host 0.0.0.0, port 5173)
pnpm dev

# Build for production
pnpm build

# Lint the codebase (ESLint only)
pnpm lint

# Preview production build
pnpm preview

# Vitest (vitest.config.js — node env, src/**/*.test.js, no PWA plugin); pure utilities only
pnpm test
```

## Architecture

### State Management
- **Redux Toolkit** for global state management
- Store location: `src/stores/store.js`
- Slices: `auth`, `user`, `product`, `customer`, `customerType`, `customerFiscalData`, `sale`, `invoice`, `deliveryOrder`, `dashboard`
- Each slice located in `src/stores/slices/{domain}/{domain}Slice.js` — **exception:** `customerType` is nested under `customer/` (`src/stores/slices/customer/customerTypeSlice.js`), and `customerType` has no `src/hooks/customerType/` dir of its own
- **`customerAccount` (abonos y crédito) has no slice on purpose:** every view fetches on open into hook-local state (`useAccountQuery`) and refreshes after each operation; it reuses the `deliveryOrder`, `customer` and `user` slices where those lists already live

### API Communication Pattern
Three-layer architecture for each domain (user, product, customer, customerType, customerFiscalData, sale, invoice, deliveryOrder, customerAccount):

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
   - File uploads use `multipart/form-data` via the same axios instance (e.g. `productService.uploadProductImage(id, file)` builds a `FormData` with a `file` part and `POST`s to `/{id}/image` — do **not** hand-set `Content-Type`, the browser adds the multipart boundary; the JWT interceptor still applies). Returns the updated DTO (incl. `imageUrl`)

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
- `src/routes/FruitRoute.jsx`: Main application routes with Sidebar layout. Shell `sx` lives in `src/styles/js/AppShellStyles.js` (`appShellStyles.main(isImmersiveRoute)` — immersive routes get the 12px `POS_GUTTER_PX` gutter instead of the default padding): the main area is `flexGrow: 1; minWidth: 0` (no fixed `calc(100% - 250px)`), so it follows the Sidebar width
- Pattern: Domain resources use CRUD routes (`/{domain}`, `/{domain}/register`, `/{domain}/edit/:id`)
- Multi-word domains use kebab-case in URLs (e.g. `customerFiscalData` → `/customer-fiscal-data`, `/customer-fiscal-data/register`, `/customer-fiscal-data/edit/:id`)
- Customer account routes (English, like the rest): `/customers/:customerId/account` (`ProtectedRoute`, all roles), `/customers/debts` and `/payments/history` (`AdminRoute`, Sidebar group "Cobranza" in `fullMenuItems` only)
- `/pending` ("Pendientes") was **retired**: the route is a `<Navigate to="/delivery?filtro=saldo" replace/>` and both menus dropped it; its manual `paid` toggle / "Marcar como Activo" are now rejected by the backend

### Component Organization
- `src/components/layout/`: Layout components (Sidebar). On `md`+ the Sidebar takes `collapsed` / `onToggleCollapse` from `FruitRoute` (`useSidebarCollapse`, `src/hooks/layout/`): collapsed it is a **64px icon rail** (leaf links flattened, `Tooltip` + `aria-label`, 48px targets), expanded the usual 250px. It **auto-collapses on the immersive routes** (`/sale/register`, `/sale/edit/:id`, `/products/quick-prices` — `IMMERSIVE_ROUTE_PATTERNS` in `useSidebarCollapse`) and re-expands on leaving; the header button toggles it manually. The state is derived during render (previous-route pattern), not in an effect. Every destination has its own icon because the rail has no labels. The mobile drawer is unchanged
- `src/components/auth/`: Auth guards (AdminRoute)
- `src/components/common/`: Reusable UI components (StatsCard, StatsCardContainer, ConfirmDialog, PwaUpdatePrompt — see PWA)
- `src/components/{domain}/`: Domain-specific components
  - `{Domain}Table.jsx`: Data grid/table component
  - `{Domain}Form.jsx`: Create/edit form component
- **Sale register view (`/sale/register`) breaks the table/form pattern** — it is an asymmetric POS layout, not a CRUD form. `SaleForm.jsx` composes `useSaleForm` and renders a MUI Grid v2 split: left ~70% = `ProductCatalog.jsx` (search + category filter chips + responsive grid of `ProductCard.jsx` tiles, replaced the old products table) and right ~30% (see perf note below) = **one** outlined "ticket" `Paper` with stacked sections: `SalePanelHeader.jsx` (user chip, `OperationTypeToggle.jsx` as its child — a compact admin-only `ToggleButtonGroup` — and "Abrir Caja") → `SaleInfo.jsx` → conditional `DeliveryOrder.jsx` → `ShoppingCart.jsx`. `RegisterSalePage` renders `SaleForm` directly (no `Container`/`Card`) and the view is sized to the window on `md`+ (`calc(100dvh - 2 × POS_GUTTER_PX)`, constant shared with `AppShellStyles.js`), so there is no page scroll. `SalePanelHeader` carries the **"Abrir Caja"** `IconButton` (`PointOfSale` icon) rendered only when `canOpenDrawer` (ADMIN or CAJERO — backend rejects PEDIDOS); it calls `useSaleForm.handleOpenDrawer` to pop the cash drawer without a sale (see Local Agent). `SaleInfo` puts Cliente and Método de pago in a flex-wrap row (two columns when the panel's real width allows, stacked otherwise — it follows the Sidebar state, which viewport breakpoints can't see) and hides the notes field behind "+ Agregar nota" (shown while editing or when it has text). `DeliveryOrder` is a compact amber-accented section: address/phone are read-only text inside a `Collapse`, while the credit chip, "Ver cuenta" and the credit alerts stay outside it, always visible. `ShoppingCart` is a flex column whose totals + "Cobrar Venta"/"Cancelar" footer stays pinned while the cart list scrolls (the scroll lives on the `TableContainer` so the sticky header works); its table has 4 columns (Producto with `$X / unit` + a red discount tag only when `detail.discount > 0`, Cant., Total, Acción) and the footer shows Subtotal/Descuento only when `totalDiscount > 0`. Cart lines carry no unit, so `SaleForm` passes `productUnits` (`{productId: unitMeasure}`, memoized from `products`). **Visual language (keep it):** one institutional green (`posPalette` in `SaleFormStyles.js`; it equals the theme's `success`, so components use `color="success"`), neutral surfaces, thin rules, `tabular-nums` on every price/weight/total, no gradients. Red is only for delete / credit / scale-disconnected, amber only for warnings and the active "Domicilio" mode, and "Cobrar Venta" is the single saturated block. `disableRipple` is global, so touch feedback is an `:active` scale. Touch targets are ≥44px (48px for primary actions). **Credit check (new delivery orders only, non-walk-in customers):** `useSaleForm` loads the customer's account through `useCustomerCredit` and exposes `credit`, `creditReached` (debt > 0 && debt ≥ limit), `creditBlocked` (`creditReached` && !ADMIN → `ShoppingCart`'s `saveBlocked` disables "Cobrar Venta" and `handleSubmit` refuses) and `creditWarning` (limit > 0 && debt + total > limit, non-blocking); `DeliveryOrder.jsx` renders the "Debe $X de $Y" chip, the alerts and a "Ver cuenta" link. Editing a sale and counter sales skip it. Clicking a `ProductCard` opens `AddProductForm.jsx` (quantity + scale via `QuantityInput`, read-only price/total). `QuantityInput` offers touch quick-adjust (− / + buttons and `+0.25 +0.5 +1 +2` chips for KILOGRAMO/LITRO, `+1 +2 +5 +10` otherwise) only when the product has no scale or the scale is disconnected — with the scale connected the weight effect overwrites manual input; scale status chips show only for KILOGRAMO. `ProductCard` shows the product photo via `<Avatar src={product.imageUrl}>` — MUI's native fallback renders the initials+`categoryColor` placeholder when `imageUrl` is null/empty/broken, so the `productInitials`/`categoryColor` helpers stay the fallback (no extra state, `React.memo` intact). Reusable `sx`, the palette and the per-category color/label/initials helpers (plus `CATEGORY_OPTIONS`, `unitLabel` and `touchMenuProps`) for this view live in `src/styles/js/SaleFormStyles.js`; category colors are identity only (Avatar fallback + an 8px dot), not UI chrome. **Post-sale flow:** "Cobrar Venta" opens `PaymentModal.jsx` (numpad/denominations + "Requiere Factura"); on a successful save `SaleForm` renders `PostSaleSummaryModal.jsx` (see Ticket/Printing) — there is **no** "print ticket" checkbox in the payment modal.
  - **Catalog performance pattern (preserve this):** the product list can be large (~250 items), so `ProductCatalog` paginates client-side at `ITEMS_PER_PAGE = 24` (slices `filteredProducts` before mapping; MUI `<Pagination>` below the grid with 44px items; the category filter is local state in `ProductCatalog`; `page` resets to 1 via `useEffect` on `productSearch` and `category`; grid breakpoints `{xs:6, sm:4, md:3, lg:3, xl:2}` = 2/3/4/4/6 tiles per row). `ProductCard` is wrapped in `React.memo`, kept effective by a referentially stable `onSelect` chain: `useSaleForm.handleSelectProduct` (memoized with `useCallback`) → `SaleForm.handleOpenProductDialog` (`useCallback`) → `ProductCatalog.handleSelect` (`useCallback`). Keep these callbacks stable when editing this view.
- **Quick price-edit view (`/products/quick-prices`, `AdminRoute`, admin post-login landing) also breaks the table pattern** — touch UI tuned for 1920x1080, not a DataGrid, and visually a twin of `ProductCatalog`. `ProductPriceEditor.jsx` (composes `useQuickPrices`) is one outlined `Paper` sized to the window on `md`+ (`quickPricesStyles.page`, `calc(100dvh - 2 × POS_GUTTER_PX)`, full width, Sidebar auto-collapsed) that **reuses `saleFormStyles` directly** for the toolbar (`catalogToolbar`: search with a `Close` clear button + category chips), the scrolling grid (`catalogGridScroll`) and the footer (`catalogFooter`: count left, `paginationTouch` centered). Grid v2 `spacing={1.5}`, `size={{xs:12, sm:6, md:3, lg:2, xl:2}}` → 6×4 on 1080p; on `xs` the card turns horizontal (76px Avatar left, content right) so the price input has room, and the category chips (`quickPricesStyles.categoryChips`) become one swipeable row below `md` — memoized `ProductPriceCard.jsx` tiles per page (`ITEMS_PER_PAGE = 24`); on `xl` the Avatar height is a `clamp()` over `100dvh` (`FOUR_ROWS_CHROME_PX` in `QuickPricesStyles.js` — update it if the card body or toolbar height changes) so four rows fit 1080p. `useQuickPrices` owns the **300ms debounce** (private `useDebounce`), `selectedCategory` (`ALL_CATEGORIES = 'ALL'`) and the combined `filteredProducts`; `page` resets to 1 during render (previous-key pattern, no effect) when `debouncedSearch` or `selectedCategory` changes. Each card: square `<Avatar src={product.imageUrl}>` (native initials+`categoryColor` fallback), one-line name, a meta row (category dot + label + unit left, `ID` right), and a `type="number" inputMode="decimal"` price `TextField` with dynamic `aria-label` ("Precio de {name}"), `data-price-input="true"`, only a `$` start adornment inside the input (the unit lives in the meta row as `Categoría · kg` — an end adornment clipped the digits on narrow cards), select-all on focus. It saves **both** onBlur and via a 48px Save button. **Keyboard contract (keep it):** `Enter` only moves focus to the next `[data-price-input]` (the blur does the save — calling `commit()` too would double-`PUT`); `Escape` sets `skipCommitRef` before restoring the draft and blurring, so the discarded value isn't saved; `commit` is guarded by an `inFlightRef`. Green border = unsaved change, green ring + check for 1.5s = saved. Reuses the existing data layer — `productService.updateProductPrice` (`PUT /update-price/{id}`, body `{price}`) + `useProduct.handleUpdatePriceProduct` (already routed through `useApiErrorHandler`); **no new API/service/slice**. `useQuickPrices.handleSavePrice` has `[]` deps and calls the latest `handleUpdatePriceProduct` through a ref (that callback is new every render — see `useApiErrorHandler`), which is what keeps `ProductPriceCard`'s `React.memo` effective. Own `sx` (page + card only, on `posPalette`) in `src/styles/js/QuickPricesStyles.js`. This view **replaced the retired** `SimpleProductTable` + `useProductTableSimple` (old `/product/price-change` route, now removed).

### Custom Hooks
- `useApiErrorHandler`: Centralized error handling with Spanish messages
  - Handles HTTP status codes (400-503)
  - Shows toast notifications via react-toastify
  - Auto-logout on 401 responses
  - Signature `handleApiError(error, customMessages = {}, {serverMessageStatuses = []} = {})`. Message priority: backend `response.data.error` (only when `status` is listed in `serverMessageStatuses` and the field is a non-blank string) → `customMessages[status]` → built-in Spanish default. Opt-in **per status** on purpose: Spring's own 403/500 bodies carry English text (`"Forbidden"`, `"An unexpected error occurred"`), so never surface server messages globally
  - **Not referentially stable:** it depends on `useAuth().handlerLogout`, which isn't memoized, so `handleApiError` — and every domain-hook callback built on it (`getAllUsers`, `handleGetCustomers`, …) — is a new function each render. Never list those callbacks in effect dependencies (that refetches on every render); use `[]` or `useEffectEvent`
  - Also **returns** `{status, message, fieldErrors, isNetworkError}` (older callers ignore it). `fieldErrors` is the Spring `@Valid` 400 body (flat `{field: message}`, no `error` key — messages are English, so validate in Spanish on the client first); `isNetworkError` (no response / timeout) drives "Reintentar"
  - `useSale.handleSaveSale` / `handleChangeStatus` and `useDeliveryOrder.handleChangeDeliveryOrderStatus` pass `serverMessageStatuses: [400]` so business-rule messages (credit limit, "tiene pedido a domicilio", "tiene abonos registrados") reach the user
- Domain hooks (`useUser`, `useProduct`, `useCustomer`, `useCustomerType`, `useCustomerFiscalData`, `useSale`, `useInvoice`, `useDeliveryOrder`): Combine service calls with Redux
- **Table hooks** (`use{Domain}Table.jsx`): Each table component has a companion hook that provides debounced search (300ms), filtered data, and MUI DataGrid column configuration
- Special hooks:
  - `useSaleForm`: Complex form hook managing cart state, customer discounts, product search, validation, delivery order integration, and **hot-stamp invoicing** (composes `useCustomerFiscalData` for the fiscal-profile list and `useInvoice` to call `handleTimbrarInvoice` after a successful save, then auto-fires `handleSendInvoiceEmail` fire-and-forget if `fiscalData.emailFacturacion` is populated — email failure never blocks the committed sale). Supports two operation types: `'venta'` (sale) and `'pedido'` (delivery order). Exposes `requiresInvoice`, `selectedFiscalId`, `customerFiscalDataList`, and their setters alongside the cart/customer state. **Deferred-print / post-sale summary:** the sale payload always sends `printTicket: false` (backend never auto-prints on save). On a successful save `handleSubmit` does **not** clear the form immediately — it fills `postSaleData` (`{isOpen, saleId, total, amountTendered, changeDue}`) to open `PostSaleSummaryModal`. `handlePrintPostSaleTicket` (memoized) calls `getTicketBySaleId(saleId, getCachedStationId())` to trigger the backend's print side-effect, then runs cleanup; `handleClosePostSaleModal` (memoized) just runs cleanup. The `shouldPrintTicket` checkbox approach was removed. Also exposes `handleOpenDrawer` (memoized) + `canOpenDrawer` (ADMIN/CAJERO) for the manual cash-drawer button — calls `saleService.openDrawer(getCachedStationId())`, toasts `"Comando enviado"` on success, routes failures through `useApiErrorHandler` with `serverMessageStatuses: [503]` so the cashier sees the backend's Spanish "station not connected / check the print agent" message instead of the generic 503 text.
  - `useScale`: Hardware integration for digital scales with weight reading, connection management, and polling
  - `usePwaUpdate` (`src/hooks/pwa/`): Service Worker registration + "new version waiting" state for `PwaUpdatePrompt` (see PWA). Not an API domain — no api/service/slice
  - `useSidebarCollapse` (`src/hooks/layout/`): `{isImmersiveRoute, collapsed, toggleCollapsed}` for the app shell — auto-collapses the Sidebar on the immersive routes (POS + quick prices; see Component Organization). Not an API domain either

### Ticket/Printing System
- `src/utils/printTicket.jsx`: `printTicket()` and `previewTicket()` functions
- `src/components/sale/Ticket.jsx`: Ticket layout component (80mm thermal printer width)
- Uses React portals for print rendering
- Distinguishes between "VENTA EN CAJA" and "PEDIDO A DOMICILIO" on tickets
- `TicketPage.jsx` allows viewing and reprinting historical tickets
- **Deferred backend print (post-sale):** sales are saved with `printTicket: false`, so the backend (`POST /save`) does **not** auto-print. Instead the `GET /api/sales/{saleId}/ticket?stationId=...` endpoint has a side-effect that sends the ticket to the station's printer over WebSocket. `PostSaleSummaryModal.jsx` (MUI `Dialog`, opened by `SaleForm` after a successful sale) shows the change to return (`Typography variant="h3"`) plus total + cash tendered, with two actions: **"Imprimir Ticket"** → `useSaleForm.handlePrintPostSaleTicket` (fires the ticket GET to print, then cleans up the cart) and **"Cerrar / No Imprimir"** → `handleClosePostSaleModal` (cleanup only, no print).

### Utilities
- `src/utils/formatters.js`: Localized formatting functions
  - `formatCurrency(value)`: Mexican peso (MXN), 0 decimal places
  - `formatDate(dateString)`: Spanish locale (es-ES) with time
  - `toNumber(value)`: safe string/number → finite number (handles `,` decimal separator, null/empty → 0)
  - `formatQuantity(value)`: display-normalizes a quantity to max 3 decimals, trailing zeros stripped (used by `ShoppingCart`'s "Cant." cell)
  - `formatDate` trims fractional seconds to milliseconds first (fresh backend responses can carry nanoseconds, which Safari can't parse). Backend `LocalDateTime`s are already Mexico time with no offset — never convert them again
  - `toLocalIsoDate(date)` (`yyyy-MM-dd` from local getters — never `toISOString`, which shifts to UTC) and `currentMonthRange()` (`{from: 1st of month, to: today}`)
- `src/utils/money.js` (abonos/crédito): **integer cents** everywhere — `toCents`, `fromCents` (payload number, ≤2 decimals), `formatMoney` (2-decimal MXN, unlike `formatCurrency`'s 0), `parseMoneyInput` (`^(\d+([.,]\d{0,2})?|[.,]\d{1,2})$` — accepts `.50`)
- `src/utils/paymentPreview.js`: pure previews in cents mirroring the backend — `allocateOldestFirst`, `previewCollection` (`exact`/`shortfall`/`surplus`), `previewAccountPayment`, `previewNotePayment`, `noteBalance`, `editCap`, `previewEdit`, `previewCancel` (only `APLICADO` payments count). Tested in `src/utils/__tests__/`
- `src/utils/clientRequestId.js`: `createClientRequestId()` — `crypto.randomUUID` with a `getRandomValues` UUID v4 fallback (plain-HTTP LAN testing from a phone)
- `src/utils/paymentMethods.js`: `PAYMENT_METHODS` (1 Efectivo, 2 Transferencia, 3 Tarjeta de Crédito, 5 Tarjeta de Débito — the backend has no catalog endpoint), `CASH_PAYMENT_METHOD_ID`, `paymentMethodLabel`. `SaleInfo` and the account dialogs import it
- `src/utils/paymentHistoryActions.js`: `PAYMENT_HISTORY_ACTIONS` (CREADO/MODIFICADO/CANCELADO labels + colors) and `describeHistoryAmount`/`describeHistoryMethod`
- **Decimal precision (money/weight):** `useSaleForm.js` has private `formatToTwoDecimals` / `formatToThreeDecimals` helpers using `Math.round((n + Number.EPSILON) * factor) / factor` (factor 100 / 1000) — do **not** revert to string-exponent tricks (`"e2"`), they break on exponential-notation inputs. All cart quantities are normalized to 3 decimals at every mutation point (`computeLineAmounts`, `handleAddToCart` entry + merge) so float tails never reach state or the payload; money fields round to 2 decimals.

### Styling
- CSS files in `src/styles/css/` (Ticket, Sidebar) — legacy/global styles only; new UI uses MUI `sx`
- MUI `sx` style objects in `src/styles/js/` (FormStyles, PageHeader, PageContainer, StatsCards, AppShellStyles, SidebarStyles, DashboardStyles, SaleFormStyles, LoginPageStyles, etc.) — each exports a named `*Styles` const of plain `sx` objects (some are functions taking params)
- New/refactored UI is MUI-only (`sx`); per the AI guidelines, follow the `frontend-design` skill at `.claude/skills/frontend-design`
- **FontAwesome is loaded globally from `src/main.jsx`** (`import '@fortawesome/fontawesome-free/css/all.min.css'`). It used to be `@import`ed from the now-deleted `LoginPage.css`; four Bootstrap-era forms (`ProductForm`, `UserForm`, `CustomerForm`, `CustomerTypeForm`) still render `fas fa-save`/`fa-times`, so **do not remove that import** until those forms drop FontAwesome.
- **Login page (`/login`) is MUI-only** — `src/auth/pages/LoginPage.jsx` + `src/styles/js/LoginPageStyles.js` (`loginPageStyles`). Sober institutional look: neutral `#f4f6f4` ground with subtle pastel-green corner radial gradients, single 420px card, corporate green `#2e7d32` (hover `#1b5e20`) on a 48px-min submit button, organic (non-circular) `Avatar` holding the `Store` icon, and a show/hide password `IconButton` in the field's `endAdornment`. The old Bootstrap markup, the coral/turquoise gradient, and the emoji logo are gone. Auth logic is untouched — the page still consumes `handlerLogin` / `isLoginLoading` from `useAuth` (note the `handler*` spelling) and surfaces errors only through the hook's toasts.

### Local Agent (Scale + Station ID)
A per-terminal local agent runs at `http://localhost:8081` and serves **both** the scale and the station identity. It is optional — the app degrades gracefully when the agent is unreachable.
- **Scale** (`src/apis/scaleApi.js`): Vite dev server proxies `/api/scale` → `http://localhost:8081`; endpoints `/connect`, `/disconnect`, `/weight`, `/status`. Driven by the `useScale` hook, used in `QuantityInput` to weigh `KILOGRAMO` products.
- **Station ID** (`src/services/agentService.js`): `getStationId()` fetches `GET /api/station` and caches `stationId` in **localStorage** (key `stationId`); `getCachedStationId()` reads the cache without a network call. Called once on app load in `FruitRoute.jsx`. Unlike auth (`token`/`login` in sessionStorage), the station id lives in localStorage so it persists across sessions on the same physical terminal.
- **Where stationId flows:** attached to every sale payload (`useSaleForm.handleSubmit` sets `stationId: getCachedStationId()`), passed as a `?stationId=` query param when fetching a ticket (`saleService.getTicketBySaleId(saleId, stationId)`) so the right terminal prints, and sent to `saleService.openDrawer(stationId)` (`POST /api/sales/open-drawer?stationId=...`, ADMIN/CAJERO only) to pop the cash drawer over WebSocket without a sale. A null/uncached stationId is tolerated when fetching tickets (param omitted); for open-drawer the backend requires it (400 if blank).

### Environment Configuration
- `.env`: `VITE_API_BASE_URL=http://localhost:8080` (development)
- `.env.production`: `VITE_API_BASE_URL=https://api.lapasadita.app` (production)
- Vite build: `esnext` target, Oxc minifier, no sourcemaps. Chunks (vendor, redux, mui) are Rolldown `codeSplitting.groups` under `build.rolldownOptions.output` — Vite 8 renamed `rollupOptions` to `rolldownOptions` and removed object-form `manualChunks`, so add new vendor chunks as another `{name, test: /node_modules[\\/]pkg[\\/]/}` group

### PWA (Progressive Web App)
- Installable on mobile/desktop via `vite-plugin-pwa` (devDep), configured in `vite.config.js` as the `VitePWA` plugin alongside `react()`.
- **`registerType: 'prompt'` + `injectRegister: false`** + `workbox: {cleanupOutdatedCaches: true}`. A new SW installs and **waits**; nothing reloads until the user chooses to, because an automatic reload would throw away a half-built cart on `/sale/register`. Never switch back to `autoUpdate` and never set `skipWaiting`/`clientsClaim` by hand — `updateServiceWorker(true)` sends `SKIP_WAITING` and workbox-window reloads the page on `controlling`.
- **Registration lives in `usePwaUpdate`** (`src/hooks/pwa/usePwaUpdate.js`), which wraps `useRegisterSW` from `virtual:pwa-register/react` — `registerSW.js` is **no longer injected or emitted**. In `onRegisteredSW` it runs `registration.update()` every `UPDATE_CHECK_INTERVAL_MS` (15 min), skipping the cycle when there's no registration, a SW is already `installing`, or `navigator.onLine === false`; rejections are swallowed. Terminals keep the tab open all day, and the browser alone only checks for a new `sw.js` on navigation or every ~24 h. `useRegisterSW` reads its options once, so the interval lives for the whole app (no cleanup); in `pnpm dev` the virtual module is a stub. Exposes `{needRefresh, updateApp}` (`needRefresh` comes from a `[value, setter]` tuple — unwrap it).
- **`PwaUpdatePrompt`** (`src/components/common/`, `sx` in `src/styles/js/PwaUpdatePromptStyles.js`) is mounted in `src/AppRoutes.jsx` next to `<Routes>`, so it shows on `/login` and inside the app. MUI `Snackbar` (bottom-left, no `onClose`) + filled info `Alert` (no close X): "Hay una nueva versión disponible" + a ≥48px "Actualizar" button → `updateApp`. It stays until the user updates. Bottom-left keeps it clear of `ShoppingCart`'s footer on the right (on `md`+ it sits over the Sidebar's profile/Logout block until dismissed by updating; with the Sidebar collapsed to its rail on the immersive routes it covers the catalog's bottom-left corner instead).
- `virtual:pwa-register/react` imports `workbox-window`, which pnpm's strict layout hides from the project root, so `workbox-window` is an explicit devDependency (same version vite-plugin-pwa pulls in). Never import the virtual module from `src/utils/__tests__/` — `vitest.config.js` doesn't load the PWA plugin.
- Manifest: name "La Pasadita POS", short_name "La Pasadita", `display: standalone`, `theme_color`/`background_color` `#ffffff`, icons `/pwa-192x192.png` + `/pwa-512x512.png` (PNGs live in `public/`).
- `index.html` carries `<meta name="theme-color" content="#ffffff">` and `<link rel="apple-touch-icon" href="/pwa-192x192.png">` (no dedicated `apple-touch-icon.png`; reuses the 192 icon). The `<link rel="manifest">` is injected by the plugin at build (no SW script tag any more).
- **Cloudflare Pages headers** (`public/_headers`, next to the SPA-fallback `public/_redirects`): `Cache-Control: no-cache` for `/`, `/index.html`, `/sw.js`, `/manifest.webmanifest`; `public, max-age=31536000, immutable` for `/assets/*` (hashed filenames). Keep the rules non-overlapping — Pages joins header values when several rules match. `pnpm preview` ignores this file; check it with `curl -I` on the deployed domain.
- `pnpm build` emits `dist/manifest.webmanifest`, `dist/sw.js`, `dist/workbox-*.js` (SW runtime), plus `dist/_headers` / `dist/_redirects` copied from `public/`; the workbox-window client is bundled as `dist/assets/workbox-window.prod.es5-*.js`. No `registerSW.js`. Workbox precaches build assets; cross-origin `VITE_API_BASE_URL` calls are not cached.
- **Rollout note:** a tab still running a pre-prompt bundle (old `autoUpdate` SW) can't show the notice, and F5 doesn't activate a waiting SW — after the first deploy of prompt mode each terminal needed one Shift+F5 (or all app tabs/PWA windows closed).

### Key Dependencies
- **Core**: React 19 + Vite 8 (Rolldown bundler, Oxc transforms via `@vitejs/plugin-react` v6; no TypeScript — plain JSX/JS, no type-check script)
- **UI**: Material-UI (MUI) v9 with MUI X DataGrid v9, Bootstrap for legacy styles. v9 **removed system props** — style via `sx` only (`<Typography sx={{color: 'text.secondary', fontWeight: 600}}>`, never `color="text.secondary"`/`fontWeight={600}`; same for `Box`/`Stack`/`Grid` layout props like `justifyContent`), TextField takes `slotProps` (`{input, htmlInput, inputLabel, select}`) instead of `InputProps`/`inputProps`/`InputLabelProps`/`SelectProps`, `Grid` takes only `size` (no `item`/`xs`/`sm`), and icon names ending in `Outline` are gone (use `…Outlined`)
- **Lint**: ESLint 10 flat config with `eslint-plugin-react-hooks` v7 (`configs.flat['recommended-latest']`, includes the React Compiler rules) + `eslint-plugin-react-refresh`. `react-hooks/set-state-in-effect` is downgraded to `warn` in `eslint.config.js` because existing forms sync props into state inside effects — don't add new violations
- **Charts**: Recharts (dashboard visualizations)
- **Tests**: Vitest (devDep, `pnpm test`) — pure utilities only
- **Routing**: React Router v7
- **State**: Redux Toolkit
- **HTTP**: Axios with interceptors
- **Notifications**: react-toastify
- **Icons**: FontAwesome, MUI Icons
- **Images**: `browser-image-compression` (client-side resize/compress + WebP conversion before product-image upload; see `src/utils/imageUtils.js`)
- **PWA**: `vite-plugin-pwa` (Workbox-backed service worker, installable manifest) + `workbox-window` (devDep; client for `virtual:pwa-register/react`, must be resolvable from the root under pnpm)

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

### customerAccount (abonos y crédito)
- Backend contract: "Customer Account (abonos y crédito)" in `pasadita-api/CLAUDE.md` (DTOs in `dto/account/`). Terms in the UI: **nota** = sale, **pedido** = delivery order, **abono** = partial payment. No request body carries `employeeId` (the backend takes it from the JWT).
- **Layers:** `src/apis/customerAccountApi.js` (base `/api` — `CustomerAccountController` spans `/delivery-orders/{id}/collection`, `/customers/{id}/payments|account|credit-limit`, `/customers/debts`, `/sales/{id}/payments`) and `src/apis/salePaymentApi.js` (`/api/sale-payments`: modify, cancel, `/{id}/history`, global `/history`) → `customerAccountService` / `salePaymentService` (take and return **cents**, mapped by `src/services/mappers/customerAccountMapper.js`) → use-case hooks in `src/hooks/customerAccount/`:
  - reads via `useAccountQuery(requestKey, fetcher)` (null key = don't fetch; drops responses for an old key; `reload` keeps current data on screen; `useEffectEvent` for the fetcher): `useCustomerAccount`, `useCollectionContext` (note → customer → account), `useSalePayments(saleId, {noteTotal})`, `usePaymentHistory`, `usePaymentHistorySearch(filters, paginationModel, {enabled})`, `useCustomerDebts`, `useCustomerCredit` (POS)
  - writes via `useAccountRequest().runRequest` → `{ok, data, status, fieldErrors, isNetworkError}`: `useRegisterPayment` (modes `account` / `note`), `useModifyPayment`, `useCancelPayment`, `useUpdateCreditLimit` (also patches `creditLimit` into the `customer` slice — the PATCH returns the account, not the customer). `useRegisterCollection` handles its own errors for the known U5 case: a retried $0 collection gets 400 "no está ACTIVO"; if the note is already pending with no payments, the first attempt saved and the result is rebuilt from the account
  - helpers: `useCustomerLookup` (customers slice, loads once; source of `walkIn`), `useSaleCustomer.openCustomerAccountForSale(saleId)`, `useMoneyDialogFlow` (steps, `clientRequestId`, retry state, field errors)
  - errors: `ACCOUNT_ERROR_MESSAGES` + `ACCOUNT_ERROR_OPTIONS` (`accountErrorOptions.js`) — backend 400 as is, own Spanish 403 "No tienes permiso para esta acción", 404 "No se encontró el registro", 500 generic
- **Backend gaps (worked around in the frontend, not in the backend):** `DeliveryOrderResponseDto` has no `customerId` → `customerAccountService.getNoteInfo(saleId)` reads `customerId`/`total` from `GET /api/sales/{saleId}/details` (all roles); `GET /api/sales/{saleId}/payments` has no note total → callers pass `noteTotal` or `useSalePayments` fetches it; `GET /api/delivery-orders/all` returns **today's orders only** (older debt is reached through the account page, the POS chip and "Clientes con saldo"); `SaleResponseDto` has no `deliveryOrderId`, so `useSaleTable`'s `deliveryOrderId == null` filter is a no-op and `/sales` can't hide the `paid` toggle for delivery sales — the backend 400 (R8) is shown instead.
- **Rules the UI follows:** the backend decides; the UI previews and hides what it would reject. `PaymentDetailDto.editable` already encodes "active, no stamped invoice, and for non-admins own + same Mexico day" — never re-derive it; Cancel is ADMIN-only. Walk-in ("Público en general") is `customer.walkIn` — never hardcode id 1; it gets no debt chip, no "Registrar abono", no "Editar límite", and a collection with a shortfall is blocked in the UI. A collection equal to the total is never sent (backend 400 "nada que registrar").
- **Components** (`src/components/customerAccount/`, styles in `src/styles/js/CustomerAccountStyles.js` — "ledger" look: tabular numerals, green paid / amber balance / red over-limit, teal dialog gradient, red for cancel): `AccountDialog` (shell; `fullScreen` below `sm`, "Reintentar" banner; on the enter transition it re-focuses the `data-autofocus="true"` field — a DataGrid steals focus back to the clicked cell right after `autoFocus` fires), `MoneyField` (`inputMode="decimal"`, text not number so `,` works), `PaymentMethodSelect`, `ReasonField`, `SummaryRows`, `AllocationPreview`, `ChangeHighlight` (big "Cambio a entregar"), `PaymentResultSummary` (built from the response; drops the order's own note from `appliedPayments` **by `saleId`**, since a $0 collection returns none), `OrderStatusChip` (ACTIVO "Pagado" / PENDIENTE "Con saldo · $balance" / CANCELADO "Cancelado"), `CustomerCreditChip` ("Debe $X de $Y"), `PaymentRow`, `PaymentActionChip`, `PaymentActionDialogs` (edit / cancel / history for one row, shared by the account page and `SalePaymentsDialog`), dialogs `CollectionDialog` (5.1), `PaymentDialog` (5.3, `mode="note"` = ADMIN reconciliation capped at the note balance), `SalePaymentsDialog` (5.4), `EditPaymentDialog` (5.5, cap = note total − other active payments), `CancelPaymentDialog` (5.6), `PaymentHistoryDialog` (5.7), `CreditLimitDialog` (5.8), plus `PendingNoteCard`, `CustomerDebtsTable` (+ `useCustomerDebtsTable`), `PaymentHistoryFilters`, `PaymentHistoryTable` (+ `usePaymentHistoryTable`; first `paginationMode="server"` grid — `rowCount = totalElements`, never send `sort`). Dialogs are mounted only while open (fresh state and a fresh `clientRequestId` each time) and follow Captura → Revisar → Resultado.
- **Pages** (`src/pages/customerAccount/`): `CustomerAccountPage` (5.2), `CustomerDebtsPage` (5.9, "Total por cobrar"), `PaymentHistoryPage` (5.10, defaults to `currentMonthRange()`, employee filter from `useUser.getAllUsers`, a row opens `SalePaymentsDialog`).
- **Existing views:** `/delivery` lists CANCELADO too, has a "Solo con saldo" switch bound to `?filtro=saldo`, and its cards "Vendido hoy" (Σ `total` of non-cancelled orders) and "Por cobrar" (Σ `balance`) come from the list via `useDeliveryOrderStats` (cents) — **not** the backend `totalAmount`, which only sums paid orders and leaves out what was already paid on orders with a balance. Below `sm` (`useDeliveryOrderTable`'s `isCompact`) the actions column goes first and a controlled `columnVisibilityModel` hides id, nota, fecha, dirección and teléfono (free DataGrid features only — no column pinning); on larger screens the column-menu choices are kept in hook state. Its actions are Registrar cobro (ACTIVO && !hasPayments), Ver abonos (hasPayments), Estado de cuenta, Editar and Cancelar pedido (ADMIN, !hasPayments, not cancelled) and Ticket — the ACTIVO↔PENDIENTE toggle is gone. `/customers` adds a "Límite" column and an "Estado de cuenta" action (not for walk-in). POS: see the credit check under the sale register view.

### product (image upload)
- Entity/DTO carries `imageUrl` — a **full public URL** (Cloudflare R2), so it is used directly as an `<img>`/`<Avatar>` source; **no** `VITE_API_BASE_URL` prefix.
- Endpoint: `POST /api/products/{id}/image` (`multipart/form-data`, `file` part; ADMIN/CAJERO). Returns the updated `ProductResponseDto`. Wrapped by `productService.uploadProductImage(id, file)`.
- `useProduct.handleUploadImage(id, file, {silent})` dispatches the returned DTO via `onUpdateProduct` (so cards refresh) and toasts unless `silent`; errors via `useApiErrorHandler`. `handleSaveProduct(productData, imageFile=null)` chains the upload (silently) **after** a successful create/update — the create path is the reason, since the new id only exists post-save; a single "Producto guardado" toast covers both steps.
- `ProductForm.jsx` (still Bootstrap) adds an MUI image block: `<Button component="label">` + hidden `<input type="file" accept="image/*">` and a 72px rounded `<Avatar>` preview. Selected file is held in component state (object-URL preview, revoked on replace/unmount), seeded from `productSelected.imageUrl` in edit mode, and passed to `handleSaveProduct` on submit. Display fallback lives in `ProductCard`/`ProductPriceCard` (Avatar `src` → initials+`categoryColor`).
- **Client-side compression (before upload):** `ProductForm`'s file-input `onChange` (`handleImageChange`, now async) runs the picked file through `compressImageToWebP` (`src/utils/imageUtils.js`, backed by the `browser-image-compression` dep) **before** setting `imageFile`/preview — resizes to 800px max side, quality `0.8`, forces `image/webp` output (returned `File` renamed to `.webp`), `useWebWorker: true` keeps the UI responsive. The object-URL preview is built from the compressed WebP so the user sees exactly what uploads. Wrapped in try/catch: on any compression failure it logs and **falls back to the original file** (never blocks saving). An `isProcessingImage` flag disables the select button (label → "Procesando...") and the submit button while compressing. The util throws on error (single-responsibility); the graceful fallback lives in the component.

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
- **Hot-stamp at checkout (timbrado en caliente):** `PaymentModal.jsx` exposes a "Requiere Factura" `Checkbox` + conditional fiscal-profile `Select` populated from `state.customerFiscalData.customerFiscalDataList` (filtered to `active === true`, label `${rfc} - ${razonSocial}`). (The modal no longer has a "Imprimir Ticket" checkbox — printing is deferred to `PostSaleSummaryModal`; see Ticket/Printing.) `useSaleForm.handleSubmit` chains `handleTimbrarInvoice({saleId: result.id, fiscalId: selectedFiscalId})` **after** `handleSaveSale` resolves successfully — non-blocking: a stamping failure must not roll back or block the already-committed sale. If timbrado succeeds and `fiscalData.emailFacturacion` is populated, `handleSendInvoiceEmail` is fired fire-and-forget (`.catch(() => {})`) — email failure never blocks the sale or UI. Save is disabled when `requiresInvoice && !selectedFiscalId`. SAT-rule warning: when `requiresInvoice && total > 2000 && paymentMethodId === 1` (efectivo), render `<Alert severity="warning">` — visual only, never blocks save.
- **A-posteriori stamp from sales history (timbrado manual):** `src/components/sale/InvoiceSaleModal.jsx` is an MUI `Dialog` (props `open`, `onClose`, `saleId`) that fetches the active fiscal list via `useCustomerFiscalData.handleGetAllFiscalData()` on open, lets the admin pick a profile, and calls `useInvoice.handleTimbrarInvoice({saleId, fiscalId})`. Closes on success; uses `loading` from the invoice slice to disable buttons during the request. Triggered from the `ReceiptLong` row-action in `useSaleTable.jsx` (admin-only, alongside Edit/Payment). The modal state (`selectedSaleIdForInvoice`, `isInvoiceModalOpen`, `handleOpenInvoiceModal`, `handleCloseInvoiceModal`) lives in `useSaleTable` and is consumed by `SaleTable.jsx`, which renders `<InvoiceSaleModal/>`. The button is **always enabled** — there is no `invoiced` flag on the `Sale` payload, so a re-stamp attempt is allowed to hit the backend, which rejects with 400 "La venta ya está facturada" and `useApiErrorHandler` toasts the error.