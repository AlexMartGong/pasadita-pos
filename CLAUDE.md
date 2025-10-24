# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Point of Sale (POS) system built with React + Vite frontend. The application manages employees, products, customers, customer types, and sales with role-based access control.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Lint the codebase
npm run lint

# Preview production build
npm run preview
```

## Architecture

### State Management
- **Redux Toolkit** for global state management
- Store location: `src/stores/store.js`
- Slices: `auth`, `user`, `product`, `customer`, `customerType`, `sale`, `deliveryOrder`
- Each slice located in `src/stores/slices/{domain}/{domain}Slice.js`

### API Communication Pattern
Three-layer architecture for each domain (user, product, customer, customerType, sale, deliveryOrder):

1. **API Layer** (`src/apis/{domain}Api.js`):
   - Axios instance with base URL from `VITE_API_BASE_URL` environment variable
   - Request interceptor adds JWT from `sessionStorage.getItem("token")`
   - All API instances follow this pattern

2. **Service Layer** (`src/services/{domain}Service.js`):
   - Business logic and API calls
   - Functions for CRUD operations: `getAll`, `getById`, `save`, `update`, `delete`, `search`
   - Error handling and logging

3. **Hook Layer** (`src/hooks/{domain}/use{Domain}.js`):
   - React hooks that combine services with Redux dispatch
   - Used by components for data operations

### Authentication & Authorization
- JWT-based authentication stored in sessionStorage
- Two-level routing in `src/AppRoutes.jsx`:
  - Unauthenticated users → `/login`
  - Authenticated users → `FruitRoute` (main app routes)
- `AdminRoute` component wraps admin-only routes
- Check `isAdmin` status via `useAuth()` hook

### Routing Structure
- `src/AppRoutes.jsx`: Top-level auth routing
- `src/routes/FruitRoute.jsx`: Main application routes with Sidebar layout
- Pattern: Domain resources use CRUD routes (`/{domain}`, `/{domain}/register`, `/{domain}/edit/:id`)

### Component Organization
- `src/components/layout/`: Layout components (Sidebar)
- `src/components/auth/`: Auth guards (AdminRoute)
- `src/components/{domain}/`: Domain-specific components
  - `{Domain}Table.jsx`: Data grid/table component
  - `{Domain}Form.jsx`: Create/edit form component
  - `ConfirmDialog.jsx`: Reusable confirmation dialogs

### Custom Hooks
- `useApiErrorHandler`: Centralized error handling with Spanish messages
  - Handles HTTP status codes (400-503)
  - Shows toast notifications via react-toastify
  - Auto-logout on 401 responses
- Domain hooks (`useUser`, `useProduct`, `useCustomer`, `useCustomerType`, `useSale`, `useDeliveryOrder`): Combine service calls with Redux
- Special hooks: `useSaleForm` - Complex form hook for sales with validation, product search, cart management, and delivery order integration

### Environment Configuration
Backend API URL configured via `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

### Key Dependencies
- **UI**: Material-UI (MUI) with DataGrid, Bootstrap for legacy styles
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
6. Create components in `src/components/{domain}/`
7. Create pages in `src/pages/{domain}/`
8. Add routes to `src/routes/FruitRoute.jsx`
