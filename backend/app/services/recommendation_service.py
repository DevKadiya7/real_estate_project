from __future__ import annotations

from typing import Any

import pandas as pd

from app.core.exceptions import NotFoundError
from app.repositories.model_repository import ModelRepository
from app.repositories.property_repository import PropertyRepository


class RecommendationService:
    def __init__(self, property_repository: PropertyRepository, model_repository: ModelRepository) -> None:
        self._properties = property_repository
        self._models = model_repository

    def options(self) -> dict[str, list[str]]:
        location_df = self._properties.location_df
        return {
            "locations": sorted(str(c) for c in location_df.columns.tolist() if str(c) != "nan"),
            "apartments": sorted(str(i) for i in location_df.index.tolist() if str(i) != "nan"),
        }

    def nearby(self, location: str, radius_km: float) -> list[dict[str, Any]]:
        location_df = self._properties.location_df
        if location not in location_df.columns:
            raise NotFoundError(f"Unknown location: {location}")

        result = location_df[location_df[location] < radius_km * 1000][location].sort_values()
        return [
            {"property_name": str(k), "distance_m": float(v), "distance_km": round(float(v) / 1000, 2)}
            for k, v in result.items()
        ]

    def recommend(self, property_name: str, top_n: int = 5) -> list[dict[str, Any]]:
        location_df = self._properties.location_df
        if property_name not in location_df.index:
            raise NotFoundError(f"Unknown apartment: {property_name}")

        # The similarity matrix is computed over the full analytics dataset, which is
        # larger than `location_df` (the set of apartments we actually have names for).
        # Only the first `len(location_df)` entries of any row map back to a known
        # apartment name, so candidates beyond that are filtered out before ranking —
        # otherwise `location_df.index[...]` below can raise an out-of-bounds IndexError.
        apartment_count = len(location_df.index)
        similarity_row = self._models.combined_similarity_matrix()[location_df.index.get_loc(property_name)]
        sim_scores = [(i, score) for i, score in enumerate(similarity_row) if i < apartment_count]
        sorted_scores = sorted(sim_scores, key=lambda item: item[1], reverse=True)

        top_indices = [item[0] for item in sorted_scores[1 : top_n + 1]]
        top_scores = [item[1] for item in sorted_scores[1 : top_n + 1]]
        top_properties = location_df.index[top_indices].tolist()

        recommendations = pd.DataFrame({"PropertyName": top_properties, "SimilarityScore": top_scores})
        results = recommendations.to_dict(orient="records")
        for result in results:
            result["amenities"] = self._properties.facilities_by_name.get(result["PropertyName"], [])
        return results
