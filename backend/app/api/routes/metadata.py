from fastapi import APIRouter, Depends

from app.api.dependencies import get_metadata_service
from app.schemas.metadata import MetadataOptions
from app.services.metadata_service import MetadataService

router = APIRouter(prefix="/metadata", tags=["metadata"])


@router.get("/options", response_model=MetadataOptions)
def metadata_options(service: MetadataService = Depends(get_metadata_service)) -> MetadataOptions:
    return service.get_options()
