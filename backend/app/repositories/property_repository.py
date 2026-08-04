"""Loads and caches the property dataset + the location-advantage distance matrix."""
from __future__ import annotations

import ast

import pandas as pd

from app.core.config import Settings
from app.core.logging import get_logger
from app.utils.distance import distance_to_meters
from app.utils.pickling import read_pickle

logger = get_logger(__name__)


class PropertyRepository:
    """Owns every property-dataset read the app performs, loaded once at startup."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self.analytics_df: pd.DataFrame = pd.read_csv(settings.analytics_csv)
        self.df: pd.DataFrame = self._load_dataframe()
        self.feature_text: str = self._load_feature_text()
        self.location_df: pd.DataFrame = self._load_location_matrix()
        self.facilities_by_name: dict[str, list[str]] = self._load_facilities()

    def _load_dataframe(self) -> pd.DataFrame:
        if self._settings.dataframe_pkl.exists():
            try:
                return read_pickle(self._settings.dataframe_pkl)
            except Exception:
                logger.exception("Failed to load %s, falling back to analytics CSV", self._settings.dataframe_pkl)
        return pd.read_csv(self._settings.analytics_csv)

    def _load_feature_text(self) -> str:
        if self._settings.feature_text_pkl.exists():
            value = read_pickle(self._settings.feature_text_pkl)
            if isinstance(value, str):
                return value
        return ""

    def _load_location_matrix(self) -> pd.DataFrame:
        apartments_df = pd.read_csv(self._settings.apartments_csv)
        location_matrix: dict[str, dict[str, float]] = {}

        for _, row in apartments_df.iterrows():
            if row.get("PropertyName") == "PropertyName" or row.get("LocationAdvantages") == "LocationAdvantages":
                continue

            try:
                location_advantages = ast.literal_eval(row["LocationAdvantages"])
            except (ValueError, SyntaxError):
                continue

            distances = {
                location: distance_to_meters(distance) for location, distance in location_advantages.items()
            }
            location_matrix[str(row["PropertyName"])] = distances

        return pd.DataFrame.from_dict(location_matrix, orient="index")

    def _load_facilities(self) -> dict[str, list[str]]:
        apartments_df = pd.read_csv(self._settings.apartments_csv)
        facilities: dict[str, list[str]] = {}

        for _, row in apartments_df.iterrows():
            if row.get("PropertyName") == "PropertyName":
                continue

            try:
                top_facilities = ast.literal_eval(row["TopFacilities"])
            except (ValueError, SyntaxError):
                continue

            if isinstance(top_facilities, list):
                facilities[str(row["PropertyName"])] = [str(item) for item in top_facilities]

        return facilities
