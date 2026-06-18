from __future__ import annotations

import ast
import pickle
import re
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


ROOT_DIR = Path(__file__).resolve().parents[2]
STREAMLIT_DIR = ROOT_DIR / "streamlit_app"
DATASET_DIR = STREAMLIT_DIR / "datasets"

DATA_VIZ_PATH = DATASET_DIR / "data_viz1.csv"
FEATURE_TEXT_PATH = DATASET_DIR / "feature_text.pkl"
PIPELINE_PATH = STREAMLIT_DIR / "pipeline.pkl"
DF_PATH = STREAMLIT_DIR / "df.pkl"
APARTMENTS_PATH = ROOT_DIR / "data_collection" / "appartments.csv"
COSINE_SIM1_PATH = DATASET_DIR / "cosine_sim1.pkl"
COSINE_SIM2_PATH = DATASET_DIR / "cosine_sim2.pkl"
COSINE_SIM3_PATH = DATASET_DIR / "cosine_sim3.pkl"


def read_pickle(path: Path) -> Any:
    with open(path, "rb") as file:
        return pickle.load(file)


def load_dataframe() -> pd.DataFrame:
    if DF_PATH.exists():
        try:
            return read_pickle(DF_PATH)
        except Exception:
            pass

    return pd.read_csv(DATA_VIZ_PATH)


def load_feature_text() -> str:
    if FEATURE_TEXT_PATH.exists():
        value = read_pickle(FEATURE_TEXT_PATH)
        if isinstance(value, str):
            return value
    return ""


def load_numeric_frame(frame: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    numeric_frame = frame.copy()
    for column in columns:
        numeric_frame[column] = pd.to_numeric(numeric_frame[column], errors="coerce")
    return numeric_frame


def distance_to_meters(distance_str: Any) -> float:
    if pd.isna(distance_str):
        return np.nan

    text = str(distance_str).strip().replace(",", "")
    if not text:
        return np.nan

    match = re.search(r"([\d.]+)\s*([a-zA-Z]*)", text)
    if not match:
        return np.nan

    value = float(match.group(1))
    unit = (match.group(2) or "").lower() or text.lower()

    if "km" in unit:
        return value * 1000
    if "meter" in unit or unit.endswith("m"):
        return value
    return value


def load_location_matrix() -> pd.DataFrame:
    apartments_df = pd.read_csv(APARTMENTS_PATH)
    location_matrix: dict[str, dict[str, float]] = {}

    for _, row in apartments_df.iterrows():
        if row.get("PropertyName") == "PropertyName" or row.get("LocationAdvantages") == "LocationAdvantages":
            continue

        try:
            location_advantages = ast.literal_eval(row["LocationAdvantages"])
        except (ValueError, SyntaxError):
            continue

        distances: dict[str, float] = {}
        for location, distance in location_advantages.items():
            distances[location] = distance_to_meters(distance)

        location_matrix[str(row["PropertyName"])] = distances

    return pd.DataFrame.from_dict(location_matrix, orient="index")


app = FastAPI(title="Gurgaon Real Estate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


df = load_dataframe()
analytics_df = pd.read_csv(DATA_VIZ_PATH)
feature_text = load_feature_text()
pipeline = read_pickle(PIPELINE_PATH)
location_df = load_location_matrix()
cosine_sim1 = read_pickle(COSINE_SIM1_PATH)
cosine_sim2 = read_pickle(COSINE_SIM2_PATH)
cosine_sim3 = read_pickle(COSINE_SIM3_PATH)


class PredictRequest(BaseModel):
    property_type: str = Field(..., examples=["flat", "house"])
    sector: str
    bedRoom: float
    bathroom: float
    balcony: float
    agePossession: str
    built_up_area: float
    servant_room: float = Field(alias="servant_room")
    store_room: float = Field(alias="store_room")
    furnishing_type: float
    luxury_category: str
    floor_category: str


class RecommendRequest(BaseModel):
    property_name: str
    top_n: int = 5


def recommend_properties_with_scores(property_name: str, top_n: int = 5) -> pd.DataFrame:
    cosine_sim_matrix = 0.5 * cosine_sim1 + 0.8 * cosine_sim2 + 1.0 * cosine_sim3

    if property_name not in location_df.index:
        raise KeyError(property_name)

    sim_scores = list(enumerate(cosine_sim_matrix[location_df.index.get_loc(property_name)]))
    sorted_scores = sorted(sim_scores, key=lambda item: item[1], reverse=True)

    top_indices = [item[0] for item in sorted_scores[1 : top_n + 1]]
    top_scores = [item[1] for item in sorted_scores[1 : top_n + 1]]
    top_properties = location_df.index[top_indices].tolist()

    return pd.DataFrame({"PropertyName": top_properties, "SimilarityScore": top_scores})


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/metadata/options")
def metadata_options() -> dict[str, list[Any]]:
    return {
        "property_types": sorted(analytics_df["property_type"].dropna().astype(str).unique().tolist()),
        "sectors": sorted(analytics_df["sector"].dropna().astype(str).unique().tolist()),
        "bedrooms": sorted(pd.to_numeric(analytics_df["bedRoom"], errors="coerce").dropna().unique().tolist()),
        "bathrooms": sorted(pd.to_numeric(analytics_df["bathroom"], errors="coerce").dropna().unique().tolist()),
        "balconies": sorted(pd.to_numeric(analytics_df["balcony"], errors="coerce").dropna().unique().tolist()),
        "ages": sorted(analytics_df["agePossession"].dropna().astype(str).unique().tolist()),
        "furnishing_types": sorted(pd.to_numeric(analytics_df["furnishing_type"], errors="coerce").dropna().unique().tolist()),
        "luxury_categories": sorted(analytics_df["luxury_score"].apply(lambda score: "Low" if score < 50 else "Medium" if score < 150 else "High").dropna().unique().tolist()),
        "floor_categories": ["Low Floor", "Mid Floor", "High Floor"],
        "locations": sorted(location_df.columns.dropna().astype(str).tolist()),
        "apartments": sorted(location_df.index.dropna().astype(str).tolist()),
    }


@app.post("/api/predict")
def predict_price(payload: PredictRequest) -> dict[str, Any]:
    input_row = pd.DataFrame(
        [[
            payload.property_type,
            payload.sector,
            payload.bedRoom,
            payload.bathroom,
            payload.balcony,
            payload.agePossession,
            payload.built_up_area,
            payload.servant_room,
            payload.store_room,
            payload.furnishing_type,
            payload.luxury_category,
            payload.floor_category,
        ]],
        columns=[
            "property_type",
            "sector",
            "bedRoom",
            "bathroom",
            "balcony",
            "agePossession",
            "built_up_area",
            "servant room",
            "store room",
            "furnishing_type",
            "luxury_category",
            "floor_category",
        ],
    )

    base_price = float(np.expm1(pipeline.predict(input_row))[0])

    return {
        "property_type": payload.property_type,
        "base_price": base_price,
        "low": round(base_price - 0.22, 2),
        "high": round(base_price + 0.22, 2),
        "unit": "Cr",
    }


@app.get("/api/analytics/sector-stats")
def sector_stats() -> list[dict[str, Any]]:
    numeric_cols = ["price", "price_per_sqft", "built_up_area", "latitude", "longitude"]
    frame = load_numeric_frame(analytics_df, numeric_cols)
    grouped = frame.groupby("sector")[numeric_cols].mean().reset_index()
    return grouped.to_dict(orient="records")


@app.get("/api/analytics/feature-text")
def analytics_feature_text() -> dict[str, str]:
    return {"text": feature_text}


@app.get("/api/analytics/area-vs-price")
def analytics_area_vs_price(property_type: str = Query("flat", pattern="^(flat|house)$")) -> list[dict[str, Any]]:
    subset = analytics_df[analytics_df["property_type"] == property_type]
    return subset[["built_up_area", "price", "bedRoom"]].dropna().to_dict(orient="records")


@app.get("/api/analytics/bedroom-pie")
def bedroom_pie(sector: str = "overall") -> dict[str, Any]:
    if sector == "overall":
        data = analytics_df
    else:
        data = analytics_df[analytics_df["sector"] == sector]

    counts = data["bedRoom"].value_counts(dropna=True).sort_index()
    return {"labels": [str(index) for index in counts.index.tolist()], "values": counts.values.tolist()}


@app.get("/api/recommend/options")
def recommend_options() -> dict[str, list[str]]:
    return {
        "locations": sorted([str(column) for column in location_df.columns.tolist() if str(column) != "nan"]),
        "apartments": sorted([str(index) for index in location_df.index.tolist() if str(index) != "nan"]),
    }


@app.get("/api/recommend/nearby")
def nearby_properties(location: str, radius_km: float) -> list[dict[str, Any]]:
    if location not in location_df.columns:
        raise HTTPException(status_code=404, detail=f"Unknown location: {location}")

    result = location_df[location_df[location] < radius_km * 1000][location].sort_values()
    return [
        {"property_name": str(key), "distance_m": float(value), "distance_km": round(float(value) / 1000, 2)}
        for key, value in result.items()
    ]


@app.post("/api/recommend")
def recommend_properties(payload: RecommendRequest) -> list[dict[str, Any]]:
    try:
        recommendations = recommend_properties_with_scores(payload.property_name, top_n=payload.top_n)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=f"Unknown apartment: {payload.property_name}") from exc

    return recommendations.to_dict(orient="records")
