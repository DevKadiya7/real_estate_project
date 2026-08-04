from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.core.security import configure_cors
from app.middleware.logging_middleware import RequestLoggingMiddleware
from app.repositories.model_repository import ModelRepository
from app.repositories.property_repository import PropertyRepository
from app.services.analytics_service import AnalyticsService
from app.services.metadata_service import MetadataService
from app.services.prediction_service import PredictionService
from app.services.recommendation_service import RecommendationService

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    configure_logging(settings)

    property_repository = PropertyRepository(settings)
    model_repository = ModelRepository(settings)

    app.state.property_repository = property_repository
    app.state.model_repository = model_repository
    app.state.metadata_service = MetadataService(property_repository)
    app.state.analytics_service = AnalyticsService(property_repository)
    app.state.recommendation_service = RecommendationService(property_repository, model_repository)
    app.state.prediction_service = PredictionService(settings, model_repository, property_repository)

    logger.info("%s v%s started", settings.app_name, settings.app_version)
    yield


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title=settings.app_name, version=settings.app_version, lifespan=lifespan)

    configure_cors(app, settings)
    app.add_middleware(RequestLoggingMiddleware)
    register_exception_handlers(app)
    app.include_router(api_router)

    return app


app = create_app()
