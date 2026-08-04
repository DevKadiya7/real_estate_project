"""CLI entry point: regenerate pipeline.pkl / df.pkl / cosine-sim / feature-text artifacts.

Usage (from backend/):
    python scripts/regenerate_artifacts.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.config import get_settings
from app.core.logging import configure_logging
from app.pipelines.artifact_pipeline import regenerate_artifacts

if __name__ == "__main__":
    settings = get_settings()
    configure_logging(settings)
    regenerate_artifacts(settings)
