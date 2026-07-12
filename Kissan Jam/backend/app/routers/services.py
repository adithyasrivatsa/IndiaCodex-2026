"""
Services API Router — CRUD for AI services.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.database import get_db
from app.models.service import Service, ServiceStatus
from app.models.category import Category
from app.models.user import User
from app.schemas.service import (
    ServiceCreate, ServiceResponse, ServiceUpdate, ServiceListResponse,
)

router = APIRouter(prefix="/services", tags=["services"])


def _enrich_service(service: Service) -> dict:
    """Add joined fields to a service response."""
    data = {c.key: getattr(service, c.key) for c in service.__table__.columns}
    if service.provider:
        data["provider_name"] = service.provider.display_name or service.provider.wallet_address[:12] + "..."
        data["provider_wallet"] = service.provider.wallet_address
    if service.category:
        data["category_name"] = service.category.name
        data["category_icon"] = service.category.icon
    return data


@router.get("", response_model=ServiceListResponse)
def list_services(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
    category: str | None = None,
    search: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    min_rating: float | None = None,
    sort_by: str = "created_at",
    order: str = "desc",
    db: Session = Depends(get_db),
):
    """List services with filtering, search, and pagination."""
    query = db.query(Service).filter(Service.status == ServiceStatus.ACTIVE)

    if category:
        query = query.join(Category).filter(Category.slug == category)
    if search:
        query = query.filter(
            or_(
                Service.name.ilike(f"%{search}%"),
                Service.description.ilike(f"%{search}%"),
                Service.tags.ilike(f"%{search}%"),
            )
        )
    if min_price is not None:
        query = query.filter(Service.price_ada >= min_price)
    if max_price is not None:
        query = query.filter(Service.price_ada <= max_price)
    if min_rating is not None:
        query = query.filter(Service.rating >= min_rating)

    total = query.count()

    # Sorting
    sort_column = getattr(Service, sort_by, Service.created_at)
    if order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    services = query.offset((page - 1) * page_size).limit(page_size).all()

    return ServiceListResponse(
        services=[ServiceResponse(**_enrich_service(s)) for s in services],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(service_id: str, db: Session = Depends(get_db)):
    """Get a single service by ID."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return ServiceResponse(**_enrich_service(service))


@router.post("", response_model=ServiceResponse, status_code=201)
def create_service(payload: ServiceCreate, wallet_address: str = Query(...), db: Session = Depends(get_db)):
    """Register a new AI service (provider must supply wallet_address)."""
    # Find or create user
    user = db.query(User).filter(User.wallet_address == wallet_address).first()
    if not user:
        user = User(wallet_address=wallet_address, role="provider")
        db.add(user)
        db.flush()

    # Verify category exists
    category = db.query(Category).filter(Category.id == payload.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category_id")

    service = Service(
        provider_id=user.id,
        **payload.model_dump(),
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return ServiceResponse(**_enrich_service(service))


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: str,
    payload: ServiceUpdate,
    wallet_address: str = Query(...),
    db: Session = Depends(get_db),
):
    """Update an existing service (only the owner can update)."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    if service.provider.wallet_address != wallet_address:
        raise HTTPException(status_code=403, detail="Not authorized")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(service, key, value)

    db.commit()
    db.refresh(service)
    return ServiceResponse(**_enrich_service(service))
