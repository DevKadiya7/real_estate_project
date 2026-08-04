from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd

from app.core.config import Settings
from app.core.constants import CRORE
from app.core.exceptions import PredictionError
from app.core.logging import get_logger
from app.repositories.model_repository import ModelRepository
from app.repositories.property_repository import PropertyRepository
from app.schemas.predict import PredictRequest

logger = get_logger(__name__)

NUMERIC_INPUT_COLS = ["bedRoom", "bathroom", "balcony", "built_up_area", "servant room", "store room", "furnishing_type"]

INPUT_COLUMNS = [
    "property_type", "sector", "bedRoom", "bathroom", "balcony",
    "agePossession", "built_up_area", "servant room", "store room",
    "furnishing_type", "luxury_category", "floor_category",
]


class PredictionService:
    def __init__(
        self,
        settings: Settings,
        model_repository: ModelRepository,
        property_repository: PropertyRepository,
    ) -> None:
        self._settings = settings
        self._models = model_repository
        self._properties = property_repository

    def predict(self, payload: PredictRequest) -> dict[str, Any]:
        input_row = pd.DataFrame(
            [[
                payload.property_type,
                payload.sector,
                float(payload.bedRoom),
                float(payload.bathroom),
                float(payload.balcony),
                payload.agePossession,
                float(payload.built_up_area),
                float(payload.servant_room),
                float(payload.store_room),
                float(payload.furnishing_type),
                payload.luxury_category,
                payload.floor_category,
            ]],
            columns=INPUT_COLUMNS,
        )

        for col in NUMERIC_INPUT_COLS:
            input_row[col] = pd.to_numeric(input_row[col], errors="coerce").astype(float)

        if self._models.pipeline is not None:
            try:
                base_price = float(np.expm1(self._models.pipeline.predict(input_row)).ravel()[0])
                return {
                    "property_type": payload.property_type,
                    "base_price": round(base_price, 2),
                    "low": round(base_price - 0.22, 2),
                    "high": round(base_price + 0.22, 2),
                    "unit": "Cr",
                }
            except Exception:
                logger.exception("pipeline.predict failed, falling back to heuristic")

        return self._fallback_heuristic(payload, input_row)

    def _fallback_heuristic(self, payload: PredictRequest, input_row: pd.DataFrame) -> dict[str, Any]:
        analytics_df = self._properties.analytics_df
        try:
            subset = analytics_df[
                (analytics_df["property_type"] == payload.property_type) & (analytics_df["sector"] == payload.sector)
            ]
            median_pps = subset["price_per_sqft"].dropna().median()
            if pd.isna(median_pps):
                subset = analytics_df[analytics_df["property_type"] == payload.property_type]
                median_pps = subset["price_per_sqft"].dropna().median()
            if pd.isna(median_pps):
                median_pps = analytics_df["price_per_sqft"].dropna().median()

            if pd.isna(median_pps) or input_row.at[0, "built_up_area"] <= 0:
                raise ValueError("Insufficient data for heuristic prediction")

            price_in_inr = float(median_pps) * float(input_row.at[0, "built_up_area"])
            base_price = price_in_inr / CRORE

            return {
                "property_type": payload.property_type,
                "base_price": round(base_price, 3),
                "low": round(base_price * 0.9, 3),
                "high": round(base_price * 1.1, 3),
                "unit": "Cr",
                "note": "fallback: median price_per_sqft heuristic used",
            }
        except Exception as exc:
            raise PredictionError(f"Prediction failed: {exc}") from exc
