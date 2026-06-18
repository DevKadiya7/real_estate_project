# Gurgaon Real Estate Migration

The original Streamlit app remains in `streamlit_app/`, but the migration target is now split into:

- `backend/` for FastAPI model inference and data endpoints
- `frontend/` for the React UI

## Backend

From `backend/`:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

The frontend expects the API at `http://localhost:8000` by default.
