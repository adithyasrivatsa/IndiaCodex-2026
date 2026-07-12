"""Category schemas."""
from pydantic import BaseModel


class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str | None = None
    icon: str
    color: str

    model_config = {"from_attributes": True}
