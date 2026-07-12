"""Transaction schemas."""
from pydantic import BaseModel
from datetime import datetime


class TransactionCreate(BaseModel):
    service_id: str
    consumer_wallet: str
    input_data: str | None = None


class TransactionResponse(BaseModel):
    id: str
    service_id: str
    consumer_id: str
    provider_id: str
    amount_ada: float
    tx_hash: str | None = None
    status: str
    result_data: str | None = None
    created_at: datetime
    completed_at: datetime | None = None

    # Joined
    service_name: str | None = None

    model_config = {"from_attributes": True}
