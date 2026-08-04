from typing import Any

from fastapi import APIRouter, Depends, Query

from app.api.dependencies import get_analytics_service
from app.schemas.analytics import PropertyRecord
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/properties", response_model=list[PropertyRecord])
def list_properties(service: AnalyticsService = Depends(get_analytics_service)) -> list[dict[str, Any]]:
    return service.list_properties()


@router.get("/sector-stats")
def sector_stats(service: AnalyticsService = Depends(get_analytics_service)) -> list[dict[str, Any]]:
    return service.sector_stats()


@router.get("/feature-text")
def feature_text(service: AnalyticsService = Depends(get_analytics_service)) -> dict[str, str]:
    return {"text": service.feature_text()}


@router.get("/area-vs-price")
def area_vs_price(
    property_type: str = Query("flat", pattern="^(flat|house)$"),
    service: AnalyticsService = Depends(get_analytics_service),
) -> list[dict[str, Any]]:
    return service.area_vs_price(property_type)


@router.get("/bedroom-pie")
def bedroom_pie(
    sector: str = "overall",
    service: AnalyticsService = Depends(get_analytics_service),
) -> dict[str, Any]:
    return service.bedroom_pie(sector)
