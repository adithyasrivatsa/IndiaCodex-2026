"""
AdaCompute Backend Configuration
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "AdaCompute API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PREFIX: str = "/api"

    # Database
    DATABASE_URL: str = "sqlite:///./adacompute.db"

    # Cardano / Blockfrost
    BLOCKFROST_API_KEY: str = ""
    CARDANO_NETWORK: str = "preprod"  # preprod | preview | mainnet

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Escrow
    ESCROW_TIMEOUT_SECONDS: int = 300  # 5 minutes for demo

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


@lru_cache()
def get_settings() -> Settings:
    return Settings()
