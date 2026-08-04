from typing import Any

from fastapi import APIRouter, Depends

from app.api.dependencies import get_prediction_service
from app.schemas.predict import PredictRequest
from app.services.prediction_service import PredictionService

router = APIRouter(tags=["predict"])


@router.post("/predict")
def predict_price(
    payload: PredictRequest,
    service: PredictionService = Depends(get_prediction_service),
) -> dict[str, Any]:
    return service.predict(payload)
