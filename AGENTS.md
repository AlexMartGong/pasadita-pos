# Agent Instructions — Pasadita POS

Compact guidance for OpenCode sessions. If a fact is obvious from filenames, it is omitted.

## Tech Stack
- React 19 + Vite 8 (Rolldown/Oxc) + React Router v7
- Redux Toolkit (global state)
- Material-UI (MUI) v9 + MUI X DataGrid v9 — no system props: style with `sx` only (`sx={{color: 'text.secondary'}}`, not `color="text.secondary"`), TextField uses `slotProps`, `Grid` uses only `size`
- Axios for HTTP
- PWA via `vite-plugin-pwa` (installable, Workbox service worker, prompt-to-update) + `workbox-window` devDep
- Vitest covers **pure utilities only** (`src/utils/__tests__/`: `money`, `paymentPreview`); do not add component/hook tests or suggest more unless explicitly asked

## Development Commands
Requires Node.js ^20.19 or >=22.13 (Vite 8 needs ^20.19 / >=22.12, ESLint 10 needs ^20.19 / ^22.13 / >=24; `pnpm build` fails on Node 18: `crypto is not defined` from transitive `serialize-javascript`).
```bash
pnpm dev      # Vite dev server (host 0.0.0.0, port 5173)
pnpm build    # Production build (esnext, no sourcemaps, Rolldown codeSplitting groups in build.rolldownOptions)
pnpm lint     # ESLint 10 only (react-hooks v7 flat config; set-state-in-effect is a warning)
pnpm preview  # Preview production build
pnpm test     # Vitest (vitest.config.js, node env, src/**/*.test.js) — pure utils only
```
There is no type-check script. `package.json` pins `"packageManager": "pnpm@10.34.9"` (the pnpm 10 that last wrote the lockfile, and the store `node_modules` is linked from); don't let a pnpm 11 reinstall rewrite `pnpm-lock.yaml`.

## Architecture — Strict 3-Layer Pattern
Every domain MUST follow this separation. Never mix business logic into UI components.

1. **API Layer** — `src/apis/{domain}Api.js`
   - Axios instance with `baseURL: import.meta.env.VITE_API_BASE_URL`
   - Request interceptor injects JWT from `sessionStorage.getItem("token")`
2. **Service Layer** — `src/services/{domain}Service.js`
   - Business logic, CRUD wrappers, domain-specific lookups
   - File uploads use `multipart/form-data` via the same axios instance (`FormData` with a `file` part; never hand-set `Content-Type` — the browser adds the boundary). E.g. `productService.uploadProductImage(id, file)` → `POST /{id}/image`, returns the updated DTO.
3. **Hook Layer** — `src/hooks/{domain}/use{Domain}.js`
   - React hooks that compose services with Redux dispatch

### Domain Entities (Redux slices)
`auth`, `user`, `product`, `customer`, `customerType`, `customerFiscalData`, `sale`, `invoice`, `deliveryOrder`, `dashboard`

`customerAccount` (abonos y crédito) has api/service/hook layers but **no slice** on purpose: each view fetches on open into hook-local state.

Register any new slice in `src/stores/store.js`.

## Routing & Authorization
- Two-level routing:
  - `src/AppRoutes.jsx` — top-level auth gating (unauthenticated → `/login`)
  - `src/routes/FruitRoute.jsx` — main app routes inside `Sidebar` layout
- Route guards:
  - `AdminRoute` — `ROLE_ADMIN` only (users, products, customers, customer types, customer fiscal data)
  - `ProtectedRoute` — any authenticated user (sales, delivery, invoices, tickets, `/customers/:customerId/account`)
  - Admin-only account pages: `/customers/debts`, `/payments/history` (Sidebar group "Cobranza")
  - `/pending` was retired: it redirects to `/delivery?filtro=saldo`
- Multi-word domains use kebab-case in URLs: `customerFiscalData` → `/customer-fiscal-data`
- Non-admin users (`CAJERO`, `PEDIDOS`) get `hasLimitedAccess` and a reduced sidebar menu; redirect after login is `/sale/register`. Admin post-login landing is `/products/quick-prices` (not `/dashboard`). Redirect logic lives in `src/auth/hooks/useAuth.js`.

## API & Environment
- Dev backend: `.env` → `VITE_API_BASE_URL=http://localhost:8080`
- Prod backend: `.env.production` → `https://api.lapasadita.app`
- Scale hardware proxy (Vite only): `/api/scale` → `http://localhost:8081`
- All API errors MUST go through `useApiErrorHandler` (Spanish toasts, auto-logout on 401). Optional 3rd arg `{serverMessageStatuses: [...]}` shows the backend's `response.data.error` for those statuses only (falls back to the default text); keep it per-status — Spring's 403/500 bodies are English. `handleApiError` is **not referentially stable** (it depends on the unmemoized `useAuth().handlerLogout`), so never put it or domain-hook callbacks built on it (`getAllUsers`, `handleGetCustomers`, …) in effect deps — use `[]` or `useEffectEvent`. It also **returns** `{status, message, fieldErrors, isNetworkError}` (`fieldErrors` = Spring `@Valid` 400 body `{field: msg}`), so dialogs can mark fields or offer "Reintentar"

## PWA
- `VitePWA` in `vite.config.js`: `registerType: 'prompt'`, `injectRegister: false`, `workbox: {cleanupOutdatedCaches: true}`. A new SW waits until the user clicks "Actualizar" — no auto-reload (it would lose a half-built cart). Don't go back to `autoUpdate` or set `skipWaiting`/`clientsClaim` by hand; `updateServiceWorker(true)` does it.
- Registration lives in `src/hooks/pwa/usePwaUpdate.js` (wraps `useRegisterSW` from `virtual:pwa-register/react`; `registerSW.js` is no longer injected). It calls `registration.update()` every 15 min (`UPDATE_CHECK_INTERVAL_MS`), skipping when no registration, a SW is `installing`, or offline. Returns `{needRefresh, updateApp}`. No api/service/slice (not an API domain).
- `src/components/common/PwaUpdatePrompt.jsx` (`sx` in `src/styles/js/PwaUpdatePromptStyles.js`), mounted in `src/AppRoutes.jsx` beside `<Routes>` (shows on `/login` too): bottom-left `Snackbar` + filled info `Alert`, "Hay una nueva versión disponible" + "Actualizar"; no close button, stays until updated. Bottom-left avoids `ShoppingCart`'s footer.
- `workbox-window` is an explicit devDep: pnpm's strict layout hides it from the root, where the virtual module resolves it. Never import the virtual module from tests (vitest has no PWA plugin).
- Manifest: name "La Pasadita POS" / short_name "La Pasadita", `display: standalone`, `theme_color`/`background_color` `#ffffff`, icons `/pwa-192x192.png` + `/pwa-512x512.png` (in `public/`).
- `index.html` has `<meta name="theme-color">` + `<link rel="apple-touch-icon" href="/pwa-192x192.png">`; the manifest link is injected at build.
- Cloudflare Pages: `public/_headers` → `no-cache` for `/`, `/index.html`, `/sw.js`, `/manifest.webmanifest`; `public, max-age=31536000, immutable` for `/assets/*`. Keep rules non-overlapping (Pages merges matches). `pnpm preview` ignores it.
- `pnpm build` emits `dist/{manifest.webmanifest,sw.js,workbox-*.js,_headers,_redirects}` + `dist/assets/workbox-window.prod.es5-*.js`; **no** `registerSW.js`. Cross-origin API calls are not Workbox-cached.

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

### Product
- Quick price-edit view at `/products/quick-prices` (`AdminRoute`, admin login landing) is mobile-first and breaks the DataGrid pattern: `ProductPriceEditor` + memoized `ProductPriceCard` (responsive MUI Grid v2, 300ms debounced search, `inputMode="decimal"` price inputs with dynamic `aria-label`, save onBlur + ≥44px button). Reuses `productService.updateProductPrice` + `useProduct.handleUpdatePriceProduct` (via `useApiErrorHandler`); no new layers. Replaced the retired `SimpleProductTable`/`useProductTableSimple`.
- Image upload: DTO has `imageUrl` (full R2 public URL — use directly as `<img>`/`<Avatar>` src, no base-URL prefix). `POST /api/products/{id}/image` (multipart `file`, ADMIN/CAJERO) → `productService.uploadProductImage` → `useProduct.handleUploadImage(id, file, {silent})` dispatches the returned DTO via `onUpdateProduct`. `handleSaveProduct(productData, imageFile=null)` chains the upload silently after a successful create/update (create needs the new id). `ProductForm` (Bootstrap) adds an MUI `<Button component="label">` + hidden file input + Avatar preview. `ProductCard` & `ProductPriceCard` render `<Avatar src={product.imageUrl}>` with native fallback to initials+`categoryColor`. **Client-side compression:** `ProductForm.handleImageChange` (async) runs the file through `compressImageToWebP` (`src/utils/imageUtils.js`, via `browser-image-compression`) before setting state — resize 800px max, quality 0.8, force `image/webp` (`.webp` name), `useWebWorker:true`; preview built from the compressed WebP. try/catch falls back to the original file on failure (never blocks save); `isProcessingImage` disables select/submit buttons while compressing.

### Sale / Delivery
- `useSaleForm` is a complex hook managing cart state, customer discounts, product search, delivery order integration, and hot-stamp invoicing.
- Decimal precision: `useSaleForm`'s private `formatToTwoDecimals`/`formatToThreeDecimals` use `Math.round((n + Number.EPSILON) * factor) / factor` — never string-exponent tricks (`"e2"`). Quantities normalize to 3 decimals at every cart mutation; money rounds to 2. Display: `formatQuantity` in `src/utils/formatters.js` (max 3 decimals, trailing zeros stripped).
- Operation types: `'venta'` (sale) or `'pedido'` (delivery order).
- Tickets: `src/utils/printTicket.jsx` + `src/components/sale/Ticket.jsx` (80mm thermal width).
- Deferred-print / post-sale: sales always save with `printTicket: false` (backend never auto-prints). After a successful save, `SaleForm` opens `PostSaleSummaryModal` (shows change + total + cash); "Imprimir Ticket" calls `getTicketBySaleId(saleId, getCachedStationId())` whose backend GET side-effect prints over WebSocket, "Cerrar / No Imprimir" just cleans up. No "print ticket" checkbox in `PaymentModal`.
- Manual cash drawer: `SaleInfo`'s green header shows an "Abrir Caja" `IconButton` (`PointOfSale`) when `canOpenDrawer` (ADMIN/CAJERO only — PEDIDOS gets 403). `useSaleForm.handleOpenDrawer` calls `saleService.openDrawer(getCachedStationId())` → `POST /api/sales/open-drawer?stationId=...` (backend pops drawer over WebSocket, no sale); toasts "Comando enviado" on success, `useApiErrorHandler` on failure (with `serverMessageStatuses: [503]` so the backend's "station not connected" message reaches the cashier).

### Customer Account (abonos y crédito)
- Backend contract: "Customer Account" section of `pasadita-api/CLAUDE.md`. No body carries `employeeId` (taken from the JWT).
- Layers: `customerAccountApi` (base `/api`, endpoints span `/delivery-orders`, `/customers`, `/sales`) + `salePaymentApi` (`/api/sale-payments`) → `customerAccountService` / `salePaymentService` → use-case hooks in `src/hooks/customerAccount/` (`useCustomerAccount`, `useRegisterCollection`, `useRegisterPayment`, `useSalePayments`, `useModifyPayment`, `useCancelPayment`, `usePaymentHistory`, `usePaymentHistorySearch`, `useCustomerDebts`, `useUpdateCreditLimit`, …). Reads go through `useAccountQuery` (keyed, cancels stale responses, `useEffectEvent`); writes through `useAccountRequest` → `{ok, data, fieldErrors, isNetworkError}`.
- **Money in cents**: services take/return integer cents (`src/services/mappers/customerAccountMapper.js`); all previews/caps use `src/utils/money.js` (`toCents`, `fromCents`, `formatMoney` 2-decimal MXN, `parseMoneyInput`) and `src/utils/paymentPreview.js`. Never do money math with floats; `formatCurrency` (0 decimals) stays for the rest of the app.
- Errors: `ACCOUNT_ERROR_MESSAGES` / `ACCOUNT_ERROR_OPTIONS` (`serverMessageStatuses: [400]`) — show the backend 400 as is, own Spanish text for 403/404/500.
- The backend owns the rules: the UI only previews and hides what it would reject. `PaymentDetailDto.editable` already encodes who may edit — never re-derive it. Walk-in customer = `customer.walkIn` (never hardcode id 1).
- Money dialogs (`AccountDialog` shell, full screen below `sm`) follow Captura → Revisar → Resultado via `useMoneyDialogFlow`; `clientRequestId` (`src/utils/clientRequestId.js`, `getRandomValues` fallback for plain-HTTP LAN) is created when the dialog mounts and reused on every retry. The result step is built from the response, not the preview; exclude the order's own note from `appliedPayments` by `saleId`, not by position.
- Backend gaps worked around: delivery orders have no `customerId` → read it from `GET /api/sales/{saleId}/details` (`customerAccountService.getNoteInfo`); `GET /api/sales/{saleId}/payments` has no note total → pass `noteTotal` or let `useSalePayments` fetch it; `GET /api/delivery-orders/all` is **today only**; `SaleResponseDto` has no `deliveryOrderId`, so `/sales` can't hide the `paid` toggle for delivery sales (the backend 400 is shown instead).
- Delivery list (`/delivery`): cards "Vendido hoy" (Σ total, non-cancelled) and "Por cobrar" (Σ balance) are computed from the list (`useDeliveryOrderStats`), not from the backend `totalAmount` (paid orders only). Below `sm` the actions column goes first and `columnVisibilityModel` hides id/nota/fecha/dirección/teléfono. No manual ACTIVO↔PENDIENTE toggle; actions are Registrar cobro (ACTIVO && !hasPayments), Ver abonos (hasPayments), Estado de cuenta, Cancelar pedido (ADMIN, !hasPayments) and Edit (ADMIN, !hasPayments); "Solo con saldo" switch ↔ `?filtro=saldo`.
- POS credit check (new delivery orders, non-walk-in): `useSaleForm` exposes `credit`, `creditBlocked` (debt > 0 && debt ≥ limit && !ADMIN → "Cobrar Venta" disabled), `creditWarning` (limit > 0 && debt + total > limit, non-blocking).

## Component & File Conventions
- Table component: `src/components/{domain}/{Domain}Table.jsx`
- Table hook (debounced search + DataGrid columns): `src/hooks/{domain}/use{Domain}Table.jsx`
- Form component: `src/components/{domain}/{Domain}Form.jsx`
- Page components: `src/pages/{domain}/`
- MUI `sx` style objects: `src/styles/js/`
- Legacy CSS: `src/styles/css/` (Ticket, Sidebar only)

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
- FontAwesome is imported globally in `src/main.jsx` — do not remove it; the four Bootstrap-era forms still use `fas fa-*` icons.
- Login (`/login`) is MUI-only: `src/auth/pages/LoginPage.jsx` + `loginPageStyles` (`src/styles/js/LoginPageStyles.js`), corporate green `#2e7d32`. Auth logic uses `handlerLogin`/`isLoginLoading` from `useAuth`.

## Important Constraints
- Never bypass the 3-layer architecture.
- Always use `useApiErrorHandler` for API interactions.
- Only add tests for pure utilities (`src/utils/__tests__/`).
- Do not run `git commit`, `git push`, or other git mutations unless explicitly asked.
