"""FastAPI dependency providers.

Repositories/services are built once in `main.py`'s lifespan and stashed on
`app.state`; these `Depends` functions just hand them to routes, keeping
routes free of any direct file/model loading.
"""
from __future__ import annotations

from fastapi import Request

from app.services.analytics_service import AnalyticsService
from app.services.metadata_service import MetadataService
from app.services.prediction_service import PredictionService
from app.services.recommendation_service import RecommendationService


def get_metadata_service(request: Request) -> MetadataService:
    return request.app.state.metadata_service


def get_analytics_service(request: Request) -> AnalyticsService:
    return request.app.state.analytics_service


def get_recommendation_service(request: Request) -> RecommendationService:
    return request.app.state.recommendation_service


def get_prediction_service(request: Request) -> PredictionService:
    return request.app.state.prediction_service
