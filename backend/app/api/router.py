from fastapi import APIRouter

from app.api.routes import analytics, health, metadata, predict, recommend

api_router = APIRouter(prefix="/api")
api_router.include_router(health.router)
api_router.include_router(metadata.router)
api_router.include_router(predict.router)
api_router.include_router(analytics.router)
api_router.include_router(recommend.router)
