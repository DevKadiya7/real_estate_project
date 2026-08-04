"""Placeholder price-estimation model.

Relocated from `streamlit_app/simple_price_model.py`. This is a heuristic
stand-in used until a real trained sklearn pipeline is exported by the
`modelling/` notebooks — `PredictionService` falls back to a median
price-per-sqft heuristic if even this fails to load.
"""
from __future__ import annotations

import numpy as np
import pandas as pd


class SimplePriceModel:
    def predict(self, frame: pd.DataFrame) -> np.ndarray:
        results = []
        for _, row in frame.iterrows():
            area = float(row.get("built_up_area", 0) or 0)
            bedrooms = float(row.get("bedRoom", 0) or 0)
            bathrooms = float(row.get("bathroom", 0) or 0)
            balcony = float(row.get("balcony", 0) or 0)
            base = 0.35 + (area / 4000) + (bedrooms * 0.08) + (bathrooms * 0.05) + (balcony * 0.01)
            results.append([base])
        return np.array(results, dtype=float)
