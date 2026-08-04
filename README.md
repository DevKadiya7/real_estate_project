# Gurgaon Real Estate Intelligence

A property-intelligence web app for Gurgaon real estate: price prediction, market
analytics, and apartment recommendations. A FastAPI backend (Clean Architecture,
config-driven) serves a React + Tailwind dashboard.

## Running the app

Two terminals — backend first, frontend second.

**Terminal 1 — backend** (Windows PowerShell, using the `.venv` at the repo root):

```powershell
cd backend
..\.venv\Scripts\Activate.ps1       # if you see an execution-policy error:
                                     # Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
pip install -r requirements.txt     # first time only
uvicorn app.main:app --reload --port 8010
```

macOS/Linux/bash equivalent:

```bash
cd backend
source ../.venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8010
```

Verify it's up: `http://127.0.0.1:8010/api/health` → `{"status": "ok"}`. Interactive
API docs at `http://127.0.0.1:8010/docs`.

The entry point is `app.main:app` — **not** `main:app` — because `main.py` lives
inside the `app/` package (`backend/app/main.py`), and the command is run from
`backend/`, one level above `app/`.

**Terminal 2 — frontend:**

```bash
cd frontend
npm install       # first time only
npm run dev
```

Open `http://localhost:5173`. The dev server proxies `/api/*` to
`http://127.0.0.1:8010` by default (see `vite.config.js` / `VITE_API_PROXY_TARGET`
below) — so the backend must already be running on that port.

## Architecture

```
┌─────────────────────────┐        HTTP/JSON        ┌──────────────────────────────┐
│   frontend/ (React)     │ ───────────────────────▶ │   backend/ (FastAPI)          │
│                         │                          │                               │
│  pages/ ─▶ features/    │                          │  api/routes ─▶ services       │
│  (React Query hooks)    │ ◀─────────────────────── │        ─▶ repositories        │
└─────────────────────────┘                          └──────────────┬────────────────┘
                                                                      │ reads/writes
                                                                      ▼
                                                        ┌──────────────────────────┐
                                                        │   data/                   │
                                                        │   raw · processed · cache │
                                                        │   database · logs         │
                                                        └──────────────────────────┘
```

The backend never talks to the filesystem outside `app/core/config.py` — every path is
resolved from `Settings`, which reads `.env`. The frontend never talks to the backend
outside `src/services/*` — every API call goes through the typed service layer and a
React Query hook.

## Folder structure

```
backend/
├── app/
│   ├── api/            # routes (thin) + dependency injection + router aggregation
│   ├── core/            # config, logging, security (CORS), constants, exceptions
│   ├── schemas/          # Pydantic request/response models
│   ├── services/         # business logic (prediction, analytics, recommendation, metadata)
│   ├── repositories/      # the only code that loads data/model files
│   ├── utils/             # small stateless helpers (pickling, distance parsing)
│   ├── middleware/         # request logging
│   ├── collectors/          # offline data-collection utilities (not wired into the API)
│   ├── pipelines/            # artifact regeneration (pipeline.pkl, cosine-sim matrices)
│   └── main.py                 # app factory
├── scripts/regenerate_artifacts.py   # CLI: rebuild the pickled artifacts
└── tests/                             # pytest + httpx, one file per route module

frontend/
├── src/
│   ├── app/              # router, providers, root App component
│   ├── pages/             # one file per route, composes feature components
│   ├── features/           # dashboard / price-predictor / analytics / recommendations
│   │   └── <feature>/{components,hooks,utils}
│   │       # analytics/utils/aggregate.js computes every chart/map/sector-card
│   │       # from one fetch (GET /api/analytics/properties) — filters recompute
│   │       # instantly client-side, no per-filter backend round trip
│   ├── components/          # cross-feature building blocks
│   │   ├── ui/                # Button, Card, Table, SearchableSelect, Slider, Sheet, ...
│   │   │                        (hand-assembled shadcn-style: Radix primitives + cva)
│   │   ├── layout/             # AppShell, Sidebar, TopNav, Breadcrumbs
│   │   └── charts/              # themed Recharts wrapper (ChartCard, ChartTooltip, Sparkline)
│   ├── services/          # one file per backend resource — the only code calling fetch
│   ├── types/              # JSDoc typedefs (PropertyRecord, MarketSummary, ...) — see
│   │                          jsconfig.json (checkJs: true) for editor-level type safety
│   ├── hooks/, context/, constants/, utils/, styles/

data/
├── raw/          # source CSVs the backend reads (copied from data_collection/)
├── processed/     # cleaned analytics dataset
├── cache/          # derived artifacts safe to regenerate (cosine-sim matrices, feature text)
├── database/        # pipeline.pkl, df.pkl
├── logs/              # app.log
├── exports/            # reserved for future report/CSV exports
└── uploads/             # reserved for future file-upload features
```

Everything under `data_collection/`, `cleaned_datasets/`, `data_preprocessing/`,
`exploratory_data_analysis/`, `feature_engineering/`, `feature_selection/`, `modelling/`,
`recommender_system/`, and `visualization/` is the ML research workspace (notebooks) —
it stays at the repo root, untouched by the app. Only the files the running backend
actually reads live under `data/`.

## Data-reality notes (read before "fixing" these)

A few things on the Analysis page look like simplifications because they are —
the underlying dataset doesn't support the literal version, so each was replaced
with the closest real equivalent instead of fabricating data:

- **Map markers are sector-level, not per-property.** `data_viz1.csv` has only
  101 unique lat/long pairs for 3,329 properties — every property in a sector
  shares one coordinate. The map renders one marker per sector (real, aggregated
  stats), not one pin per listing at a fake precise address.
- **No "Sector Boundaries" map layer.** No real Gurgaon sector polygon geometry
  exists in this repo; inventing boundary shapes would be worse than not having
  the layer. Add it if you source real GeoJSON boundaries.
- **"Listings by Possession Stage" stands in for a listing-date trend.** There's
  no listing-date column. `agePossession` gives 5 real, naturally-ordered
  lifecycle stages instead.
- **Sector cards show "vs. city average %", not "growth %".** There's no price
  history (single snapshot dataset) — the percentage is a real spatial
  comparison, not a fabricated time trend.
- **Recommendation cards use an icon/gradient placeholder, not a photo.** No
  property images exist in the dataset.

## Map tiles

The Gurgaon map (`react-leaflet`) uses free, no-API-key tile providers:
OpenStreetMap for street view, Esri World Imagery for satellite. Both require
the attribution shown in the map's bottom-right corner (already wired up) — don't
remove it. OSM's tile servers rate-limit/block traffic that looks automated
(high request volume, no proper `Referer`); this is fine for normal interactive
use but can surface as failed tile loads under heavy scripted/headless testing.
For production traffic beyond light use, consider a paid tile provider (Mapbox,
MapTiler) or self-hosted tiles instead.

## Configuration

Both apps run with zero config out of the box (see [Running the app](#running-the-app)
above). To override a default, copy the example env file and edit it:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

See [Environment variables](#environment-variables) below for what each setting does.

### Regenerating model artifacts

If `data/processed/data_viz1.csv` changes, or `SimplePriceModel` (in
`backend/app/services/price_model.py`) moves, rebuild the pickled artifacts:

```bash
cd backend
python scripts/regenerate_artifacts.py
```

## Environment variables

**Backend** (`backend/.env`, all optional — see `backend/app/core/config.py`):

| Variable | Default | Purpose |
|---|---|---|
| `HOST` / `PORT` | `127.0.0.1` / `8010` | uvicorn bind address |
| `CORS_ORIGINS` | `["http://localhost:5173", "http://127.0.0.1:5173"]` | allowed frontend origins |
| `LOG_LEVEL` | `INFO` | logging verbosity |
| `DATA_DIR` | `<repo-root>/data` | root of the data directory |

**Frontend** (`frontend/.env.local`, both optional):

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | *(empty — uses the dev proxy)* | base URL the browser calls directly |
| `VITE_API_PROXY_TARGET` | `http://127.0.0.1:8010` | dev-server proxy target for `/api` |

## Testing

```bash
cd backend
pytest
```

15 tests cover health, metadata options, predict (happy path + validation), analytics
(including the full `properties` list), and recommend (happy path + amenities +
not-found + the similarity-index bounding fix).

## Deployment

- **Backend**: any ASGI host (`uvicorn`/`gunicorn -k uvicorn.workers.UvicornWorker`).
  Set `CORS_ORIGINS` to the deployed frontend's origin and point `DATA_DIR` at a
  persistent volume containing the `data/` tree.
- **Frontend**: `npm run build` produces a static `dist/` — serve it from any static
  host/CDN and set `VITE_API_BASE_URL` to the backend's public URL at build time.
