from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class SectorStat(BaseModel):
    sector: str
    price: float | None = None
    price_per_sqft: float | None = None
    built_up_area: float | None = None
    latitude: float | None = None
    longitude: float | None = None


class AreaPricePoint(BaseModel):
    built_up_area: Any
    price: Any
    bedRoom: Any


class BedroomPie(BaseModel):
    labels: list[str]
    values: list[int]


class FeatureText(BaseModel):
    text: str


class PropertyRecord(BaseModel):
    id: int
    property_type: str | None = None
    society: str | None = None
    sector: str | None = None
    price: float | None = None
    price_per_sqft: float | None = None
    bedRoom: float | None = None
    bathroom: float | None = None
    balcony: float | None = None
    built_up_area: float | None = None
    agePossession: str | None = None
    furnishing_type: float | None = None
    luxury_score: float | None = None
    luxury_category: str | None = None
    floor_category: str | None = None
    latitude: float | None = None
    longitude: float | None = None
