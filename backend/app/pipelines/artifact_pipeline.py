"""Regenerates the runtime pickle artifacts consumed by the repositories.

Relocated from the root-level `regenerate_pickles.py`. Running this is
required whenever `SimplePriceModel`'s module path changes (pickle embeds
the class's import path, so moving the class without regenerating the
pickle would make the old `pipeline.pkl` unloadable) or whenever the
processed dataset changes.
"""
from __future__ import annotations

import pickle

import numpy as np
import pandas as pd

from app.core.config import Settings
from app.core.constants import categorize_floor, categorize_luxury
from app.core.logging import get_logger
from app.services.price_model import SimplePriceModel

logger = get_logger(__name__)

FEATURE_COLUMNS = [
    "property_type", "sector", "bedRoom", "bathroom", "balcony", "agePossession",
    "built_up_area", "servant room", "store room", "furnishing_type", "luxury_category", "floor_category",
]

NUMERIC_COLUMNS = [
    "bedRoom", "bathroom", "balcony", "built_up_area", "servant room", "store room",
    "furnishing_type", "price_per_sqft", "luxury_score", "floorNum", "price",
]


def regenerate_artifacts(settings: Settings) -> None:
    if not settings.analytics_csv.exists():
        raise FileNotFoundError(f"Missing dataset: {settings.analytics_csv}")

    logger.info("Loading dataset from %s", settings.analytics_csv)
    df = pd.read_csv(settings.analytics_csv)

    for column in NUMERIC_COLUMNS:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")

    df["luxury_category"] = df["luxury_score"].apply(categorize_luxury)
    df["floor_category"] = df["floorNum"].apply(categorize_floor)

    settings.database_dir.mkdir(parents=True, exist_ok=True)
    settings.cache_dir.mkdir(parents=True, exist_ok=True)

    with open(settings.pipeline_pkl, "wb") as handle:
        pickle.dump(SimplePriceModel(), handle)

    with open(settings.dataframe_pkl, "wb") as handle:
        pickle.dump(df[FEATURE_COLUMNS + ["price_per_sqft"]].copy(), handle)

    with open(settings.feature_text_pkl, "wb") as handle:
        pickle.dump("This dataset contains pricing, area, luxury, and floor-based property insights.", handle)

    n = len(df)
    areas = df["built_up_area"].fillna(0).to_numpy(dtype=float)
    bedrooms = df["bedRoom"].fillna(0).to_numpy(dtype=float)

    cosine_sim1 = np.eye(n)
    cosine_sim2 = np.maximum(0.0, 1.0 - np.abs(areas[:, None] - areas[None, :]) / max(1.0, areas.max() + 1.0))
    cosine_sim3 = np.maximum(0.0, 1.0 - np.abs(bedrooms[:, None] - bedrooms[None, :]) / 5.0)

    sim1_path, sim2_path, sim3_path = settings.cosine_sim_pkls
    with open(sim1_path, "wb") as handle:
        pickle.dump(cosine_sim1, handle)
    with open(sim2_path, "wb") as handle:
        pickle.dump(cosine_sim2, handle)
    with open(sim3_path, "wb") as handle:
        pickle.dump(cosine_sim3, handle)

    logger.info("Generated pickle artifacts successfully.")
