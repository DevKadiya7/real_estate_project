from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class PredictRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    property_type: str = Field(..., examples=["flat", "house"])
    sector: str
    bedRoom: float = Field(..., alias="bedRoom")
    bathroom: float = Field(..., alias="bathroom")
    balcony: float
    agePossession: str = Field(..., alias="agePossession")
    built_up_area: float
    servant_room: float
    store_room: float
    furnishing_type: float
    luxury_category: str
    floor_category: str


class PredictResponse(BaseModel):
    property_type: str
    base_price: float
    low: float
    high: float
    unit: str
    note: str | None = None

    model_config = ConfigDict(extra="allow")

    def to_dict(self) -> dict[str, Any]:
        return self.model_dump(exclude_none=True)
