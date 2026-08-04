from __future__ import annotations

from pydantic import BaseModel


class RecommendRequest(BaseModel):
    property_name: str
    top_n: int = 5


class RecommendationItem(BaseModel):
    PropertyName: str
    SimilarityScore: float
    amenities: list[str] = []


class NearbyItem(BaseModel):
    property_name: str
    distance_m: float
    distance_km: float


class RecommendOptions(BaseModel):
    locations: list[str]
    apartments: list[str]
