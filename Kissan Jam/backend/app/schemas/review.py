"""Review schemas."""
from pydantic import BaseModel, Field
from datetime import datetime


class ReviewCreate(BaseModel):
    service_id: str
    consumer_wallet: str
    rating: float = Field(..., ge=1.0, le=5.0)
    comment: str | None = None


class ReviewResponse(BaseModel):
    id: str
    service_id: str
    consumer_id: str
    rating: float
    comment: str | None = None
    created_at: datetime

    # Joined
    consumer_name: str | None = None

    model_config = {"from_attributes": True}
