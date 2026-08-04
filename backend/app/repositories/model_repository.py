"""Loads and caches the trained pipeline + similarity artifacts.

Loading is defensive: missing/corrupt artifacts don't crash the app at
startup, they just leave the corresponding attribute `None` so routes that
don't need them keep working (matches the original main.py behavior).
"""
from __future__ import annotations

from typing import Any

from app.core.config import Settings
from app.core.logging import get_logger
from app.utils.pickling import read_pickle

logger = get_logger(__name__)


class ModelRepository:
    def __init__(self, settings: Settings) -> None:
        self.pipeline: Any | None = self._safe_load(settings.pipeline_pkl)

        sim1_path, sim2_path, sim3_path = settings.cosine_sim_pkls
        self.cosine_sim1: Any | None = self._safe_load(sim1_path)
        self.cosine_sim2: Any | None = self._safe_load(sim2_path)
        self.cosine_sim3: Any | None = self._safe_load(sim3_path)

        # cosine_sim1/2/3 never change at runtime, so the weighted sum is
        # computed once here rather than on every /api/recommend request —
        # was previously ~0.3-1.5s of matrix arithmetic per call.
        self._combined_similarity = (
            0.5 * self.cosine_sim1 + 0.8 * self.cosine_sim2 + 1.0 * self.cosine_sim3 if self.is_ready else None
        )

    @staticmethod
    def _safe_load(path) -> Any | None:
        try:
            return read_pickle(path)
        except Exception:
            logger.exception("Failed to load model artifact %s", path)
            return None

    @property
    def is_ready(self) -> bool:
        return self.cosine_sim1 is not None and self.cosine_sim2 is not None and self.cosine_sim3 is not None

    def combined_similarity_matrix(self):
        return self._combined_similarity
