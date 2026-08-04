"""Centralized, environment-driven application settings.

Every filesystem path and runtime knob used by the app is defined here and
nowhere else — services/repositories/routes must always go through
`get_settings()` rather than hardcoding a path or an env var lookup.
"""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]
ROOT_DIR = BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Gurgaon Real Estate API"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = True

    host: str = "127.0.0.1"
    port: int = 8010

    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    log_level: str = "INFO"

    data_dir: Path = ROOT_DIR / "data"

    @property
    def raw_dir(self) -> Path:
        return self.data_dir / "raw"

    @property
    def processed_dir(self) -> Path:
        return self.data_dir / "processed"

    @property
    def cache_dir(self) -> Path:
        return self.data_dir / "cache"

    @property
    def database_dir(self) -> Path:
        return self.data_dir / "database"

    @property
    def logs_dir(self) -> Path:
        return self.data_dir / "logs"

    @property
    def exports_dir(self) -> Path:
        return self.data_dir / "exports"

    @property
    def uploads_dir(self) -> Path:
        return self.data_dir / "uploads"

    @property
    def apartments_csv(self) -> Path:
        return self.raw_dir / "appartments.csv"

    @property
    def analytics_csv(self) -> Path:
        return self.processed_dir / "data_viz1.csv"

    @property
    def feature_text_pkl(self) -> Path:
        return self.cache_dir / "feature_text.pkl"

    @property
    def cosine_sim_pkls(self) -> tuple[Path, Path, Path]:
        return (
            self.cache_dir / "cosine_sim1.pkl",
            self.cache_dir / "cosine_sim2.pkl",
            self.cache_dir / "cosine_sim3.pkl",
        )

    @property
    def pipeline_pkl(self) -> Path:
        return self.database_dir / "pipeline.pkl"

    @property
    def dataframe_pkl(self) -> Path:
        return self.database_dir / "df.pkl"

    @property
    def log_file(self) -> Path:
        return self.logs_dir / "app.log"


@lru_cache
def get_settings() -> Settings:
    return Settings()
