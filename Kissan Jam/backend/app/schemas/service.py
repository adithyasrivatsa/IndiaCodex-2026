"""Service schemas."""
from pydantic import BaseModel, Field
from datetime import datetime


class ServiceCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=128)
    description: str = Field(..., min_length=10)
    short_description: str | None = Field(None, max_length=256)
    category_id: str
    price_ada: float = Field(..., gt=0)
    endpoint_url: str
    docs_url: str | None = None
    version: str = "1.0.0"
    model_name: str | None = None
    example_input: str | None = None
    example_output: str | None = None
    tags: str | None = None


class ServiceUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    short_description: str | None = None
    price_ada: float | None = Field(None, gt=0)
    endpoint_url: str | None = None
    docs_url: str | None = None
    version: str | None = None
    status: str | None = None
    tags: str | None = None


class ServiceResponse(BaseModel):
    id: str
    provider_id: str
    category_id: str
    name: str
    description: str
    short_description: str | None = None
    price_ada: float
    endpoint_url: str
    docs_url: str | None = None
    avg_latency_ms: int
    success_rate: float
    total_jobs: int
    uptime: float
    rating: float
    review_count: int
    version: str
    model_name: str | None = None
    example_input: str | None = None
    example_output: str | None = None
    tags: str | None = None
    status: str
    created_at: datetime
    updated_at: datetime

    # Joined fields
    provider_name: str | None = None
    provider_wallet: str | None = None
    category_name: str | None = None
    category_icon: str | None = None

    model_config = {"from_attributes": True}


class ServiceListResponse(BaseModel):
    services: list[ServiceResponse]
    total: int
    page: int
    page_size: int
