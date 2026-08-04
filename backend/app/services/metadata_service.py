from __future__ import annotations

import pandas as pd

from app.core.constants import FLOOR_CATEGORIES, categorize_luxury
from app.repositories.property_repository import PropertyRepository
from app.schemas.metadata import MetadataOptions


class MetadataService:
    def __init__(self, property_repository: PropertyRepository) -> None:
        self._properties = property_repository

    def get_options(self) -> MetadataOptions:
        df = self._properties.analytics_df
        location_df = self._properties.location_df

        return MetadataOptions(
            property_types=sorted(df["property_type"].dropna().astype(str).unique().tolist()),
            sectors=sorted(df["sector"].dropna().astype(str).unique().tolist()),
            bedrooms=sorted(pd.to_numeric(df["bedRoom"], errors="coerce").dropna().unique().tolist()),
            bathrooms=sorted(pd.to_numeric(df["bathroom"], errors="coerce").dropna().unique().tolist()),
            balconies=sorted(pd.to_numeric(df["balcony"], errors="coerce").dropna().unique().tolist()),
            ages=sorted(df["agePossession"].dropna().astype(str).unique().tolist()),
            furnishing_types=sorted(
                pd.to_numeric(df["furnishing_type"], errors="coerce").dropna().unique().tolist()
            ),
            luxury_categories=sorted(df["luxury_score"].apply(categorize_luxury).dropna().unique().tolist()),
            floor_categories=list(FLOOR_CATEGORIES),
            locations=sorted(location_df.columns.dropna().astype(str).tolist()),
            apartments=sorted(location_df.index.dropna().astype(str).tolist()),
        )
