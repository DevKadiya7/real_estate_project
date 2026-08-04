from typing import Any

from fastapi import APIRouter, Depends

from app.api.dependencies import get_recommendation_service
from app.schemas.recommend import RecommendRequest
from app.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/recommend", tags=["recommend"])


@router.get("/options")
def recommend_options(
    service: RecommendationService = Depends(get_recommendation_service),
) -> dict[str, list[str]]:
    return service.options()


@router.get("/nearby")
def nearby_properties(
    location: str,
    radius_km: float,
    service: RecommendationService = Depends(get_recommendation_service),
) -> list[dict[str, Any]]:
    return service.nearby(location, radius_km)


@router.post("")
def recommend_properties(
    payload: RecommendRequest,
    service: RecommendationService = Depends(get_recommendation_service),
) -> list[dict[str, Any]]:
    return service.recommend(payload.property_name, top_n=payload.top_n)
