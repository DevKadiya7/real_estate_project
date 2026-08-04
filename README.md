# Gurgaon Real Estate Intelligence

A property-intelligence web app for Gurgaon real estate: AI price prediction, a
market-analytics dashboard (real interactive map, 8 charts, filters), and
amenity-enriched apartment recommendations. A FastAPI backend (Clean Architecture,
config-driven) serves a React dashboard — Tailwind, React Router, React Query,
Recharts, `react-leaflet`, Framer Motion, and hand-assembled shadcn-style
(Radix + `cva`) components.

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
│   │       # analytics/components/charts/ holds the 8 chart components; GurgaonMap.jsx
│   │       # + utils/mapHelpers.js drive the map. utils/aggregate.js computes every
│   │       # chart/map/sector-card from one fetch (GET /api/analytics/properties) —
│   │       # filters recompute instantly client-side, no per-filter backend round trip
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

## Machine learning pipeline

The notebooks above are a real, sequential pipeline — each stage reads the previous
stage's CSV output and writes the next one:

1. **Collection** (`data_collection/`) — raw listings scraped into `flats.csv`,
   `houses.csv`, `appartments.csv` (society-level facilities/price/location).
2. **Per-source cleaning** (`data_preprocessing/data-preprocessing-{flats,houses}.ipynb`)
   → merged (`merge-flats-and-house.ipynb`) → sector name normalization
   (`data-preprocessing-level-2.ipynb`, ~100 colony names manually mapped to
   canonical `sector N` labels).
3. **Outlier treatment** (`data_cleaning_pipeline/outlier-treatment.ipynb`) — IQR-based
   detection plus manual area-unit-scale fixes.
4. **Missing-value imputation** (`data_cleaning_pipeline/missing-value-imputation.ipynb`)
   — ratio-based `built_up_area` imputation from carpet/super-built-up area, median/mode
   fills elsewhere.
5. **Feature engineering** (`feature_engineering/feature-engineering.ipynb`) — parses
   `built_up_area`/`carpet_area` out of free text; explodes room flags (servant/store/
   study/pooja); buckets `agePossession`; clusters furnishing-item counts with
   `KMeans(n_clusters=3)` into `furnishing_type`; computes **`luxury_score`** as a
   `MultiLabelBinarizer` of ~100 amenities dot-producted with hand-authored weights
   (4–10 each, e.g. Golf Course=10).
6. **Feature selection** (`feature_selection/feature-selection.ipynb`) — bins
   `luxury_score`→`luxury_category` and `floorNum`→`floor_category`; ranks features by
   averaging 5 techniques (Random Forest / Gradient Boosting importances, permutation
   importance, RFE, SHAP `TreeExplainer`), corroborated with a 5-fold CV R² drop-test;
   drops the weakest columns.
7. **Model selection** (`modelling/baseline model.ipynb` → `modelling/model-selection.ipynb`)
   — compares Linear/Ridge/Lasso, SVR, Decision Tree, Random Forest, Extra Trees,
   Gradient Boosting, AdaBoost, MLP, and XGBoost across 4 encoding strategies (Ordinal,
   One-Hot, One-Hot+PCA, Target Encoding), all on `log1p(price)`, scored by 10-fold CV
   R² and holdout MAE. Best: **Random Forest** with target-encoded `sector`
   (CV R² ≈ 0.90, MAE ≈ ₹0.45 Cr); `GridSearchCV` tuned it to
   `{max_depth: 20, max_features: 'sqrt', n_estimators: 300}`. The final exported
   `pipeline.pkl` is `ColumnTransformer(OneHotEncoder) → RandomForestRegressor(n_estimators=500)`
   trained on the full dataset, on this feature set: `property_type, sector, bedRoom,
   bathroom, balcony, agePossession, built_up_area, servant room, store room,
   furnishing_type, luxury_category, floor_category`.
8. **Recommendations** (`recommender_system/recommender-system.ipynb`) — three
   246×246 cosine-similarity matrices per society: **`cosine_sim1`** on TF-IDF
   (`TfidfVectorizer`, 1-2 grams) of each society's `TopFacilities`; **`cosine_sim2`**
   on one-hot-encoded + scaled per-BHK price/area ranges from `PriceDetails`;
   **`cosine_sim3`** on scaled distances to nearby landmarks from `LocationAdvantages`.

> **The notebooks' real trained Random Forest pipeline is not what's currently
> deployed.** `backend/app/services/price_model.py`'s `SimplePriceModel` is a
> deliberate lightweight placeholder (a linear heuristic on area/bedrooms/bathrooms),
> not the notebooks' CV-tuned model — see `git log` / the refactor history for why.
> To deploy the real model: export the notebook's fitted `pipeline` object to
> `data/database/pipeline.pkl` (matching the feature set above) instead of running
> `scripts/regenerate_artifacts.py`, which currently (re)writes the placeholder.
> The three `cosine_sim*.pkl` files are similarly regenerated as a synthetic
> area/bedroom-based placeholder by that script, not the notebook's TF-IDF/price/
> location similarity — swap in real ones the same way if you need the notebook's
> actual recommendation quality.

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
