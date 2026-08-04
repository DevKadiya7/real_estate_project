from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class MetadataOptions(BaseModel):
    property_types: list[str]
    sectors: list[str]
    bedrooms: list[Any]
    bathrooms: list[Any]
    balconies: list[Any]
    ages: list[str]
    furnishing_types: list[Any]
    luxury_categories: list[str]
    floor_categories: list[str]
    locations: list[str]
    apartments: list[str]
