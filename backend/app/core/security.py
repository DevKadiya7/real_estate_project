"""CORS hardening.

The legacy app allowed every origin (`allow_origins=["*"]`). Origins are now
sourced from `Settings.cors_origins` (configurable via the `CORS_ORIGINS` env
var) and default to just the local Vite dev server, not the open internet.
"""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import Settings


def configure_cors(app: FastAPI, settings: Settings) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
