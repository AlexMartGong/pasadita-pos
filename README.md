# La Pasadita POS

Point of Sale (POS) frontend built with React 19 + Vite 8 and Material UI 9. See `CLAUDE.md` for full architecture docs.

## Requirements

- **Node.js ^20.19 or >=22.13** (Node 24 recommended; required by Vite 8 and ESLint 10, and `pnpm build` fails on Node 18 with `crypto is not defined`)
- **pnpm** (all tooling uses pnpm)

## Commands

```bash
pnpm dev      # Dev server with HMR (host 0.0.0.0, port 5173)
pnpm build    # Production build
pnpm lint     # ESLint
pnpm preview  # Preview production build
```

There is no test runner or type-check script.

## Environment

- `.env`: `VITE_API_BASE_URL=http://localhost:8080` (development)
- `.env.production`: `VITE_API_BASE_URL=https://api.lapasadita.app` (production)
- Optional local agent at `http://localhost:8081` (scale hardware + station ID); the app degrades gracefully without it.
