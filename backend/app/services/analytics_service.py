from __future__ import annotations

from typing import Any

import numpy as np
import pandas as pd

from app.core.constants import categorize_floor, categorize_luxury
from app.repositories.property_repository import PropertyRepository

NUMERIC_COLS = ["price", "price_per_sqft", "built_up_area", "latitude", "longitude"]

PROPERTY_RECORD_COLS = [
    "property_type", "society", "sector", "price", "price_per_sqft", "bedRoom",
    "bathroom", "balcony", "built_up_area", "agePossession", "furnishing_type",
    "luxury_score", "latitude", "longitude",
]


class AnalyticsService:
    def __init__(self, property_repository: PropertyRepository) -> None:
        self._properties = property_repository

    def sector_stats(self) -> list[dict[str, Any]]:
        frame = self._properties.analytics_df.copy()
        for column in NUMERIC_COLS:
            frame[column] = pd.to_numeric(frame[column], errors="coerce")
        grouped = frame.groupby("sector")[NUMERIC_COLS].mean().reset_index()
        return grouped.to_dict(orient="records")

    def feature_text(self) -> str:
        return self._properties.feature_text

    def area_vs_price(self, property_type: str) -> list[dict[str, Any]]:
        df = self._properties.analytics_df
        subset = df[df["property_type"] == property_type]
        return subset[["built_up_area", "price", "bedRoom"]].dropna().to_dict(orient="records")

    def bedroom_pie(self, sector: str) -> dict[str, Any]:
        df = self._properties.analytics_df
        data = df if sector == "overall" else df[df["sector"] == sector]
        counts = data["bedRoom"].value_counts(dropna=True).sort_index()
        return {"labels": [str(i) for i in counts.index.tolist()], "values": counts.values.tolist()}

    def list_properties(self) -> list[dict[str, Any]]:
        """Full row-level dataset for client-side filtering/aggregation (map, charts,
        sector insights, filter panel all derive from this single fetch)."""
        frame = self._properties.analytics_df.copy()
        for column in NUMERIC_COLS + ["bedRoom", "bathroom", "balcony", "furnishing_type"]:
            frame[column] = pd.to_numeric(frame[column], errors="coerce")

        frame["luxury_category"] = frame["luxury_score"].apply(categorize_luxury)
        frame["floor_category"] = frame["floorNum"].apply(categorize_floor)

        records = frame[PROPERTY_RECORD_COLS + ["luxury_category", "floor_category"]].copy()
        records = records.replace({np.nan: None})
        records.insert(0, "id", records.index)
        return records.to_dict(orient="records")
