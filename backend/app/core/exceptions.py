"""Domain exception hierarchy + FastAPI exception handlers.

Services raise these instead of `HTTPException` so business logic stays
decoupled from the web framework; the handlers registered in `main.py`
translate them into HTTP responses at the edge.
"""
from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Base class for all domain errors."""

    status_code = 500

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class NotFoundError(AppError):
    status_code = 404


class ModelUnavailableError(AppError):
    status_code = 503


class PredictionError(AppError):
    status_code = 500


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})
