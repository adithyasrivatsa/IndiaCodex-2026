"""
Categories API Router.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryResponse

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    """List all AI service categories."""
    categories = db.query(Category).order_by(Category.name).all()
    return [CategoryResponse.model_validate(c) for c in categories]
