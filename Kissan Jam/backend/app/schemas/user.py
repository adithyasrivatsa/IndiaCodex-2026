"""User schemas."""
from pydantic import BaseModel, Field
from datetime import datetime


class UserCreate(BaseModel):
    wallet_address: str = Field(..., min_length=10)
    stake_address: str | None = None
    display_name: str | None = None
    role: str = "consumer"


class UserUpdate(BaseModel):
    display_name: str | None = None
    avatar_url: str | None = None
    bio: str | None = None
    role: str | None = None


class UserResponse(BaseModel):
    id: str
    wallet_address: str
    stake_address: str | None = None
    role: str
    display_name: str | None = None
    avatar_url: str | None = None
    bio: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
