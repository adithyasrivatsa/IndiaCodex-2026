"""
Reviews API Router.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.review import Review
from app.models.service import Service
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("", response_model=ReviewResponse, status_code=201)
def create_review(payload: ReviewCreate, db: Session = Depends(get_db)):
    """Submit a review for a service."""
    service = db.query(Service).filter(Service.id == payload.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    consumer = db.query(User).filter(User.wallet_address == payload.consumer_wallet).first()
    if not consumer:
        raise HTTPException(status_code=404, detail="Consumer not found")

    review = Review(
        service_id=payload.service_id,
        consumer_id=consumer.id,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(review)

    # Update service rating
    all_ratings = db.query(func.avg(Review.rating)).filter(
        Review.service_id == payload.service_id
    ).scalar()
    review_count = db.query(func.count(Review.id)).filter(
        Review.service_id == payload.service_id
    ).scalar()

    service.rating = round(float(all_ratings or payload.rating), 2)
    service.review_count = (review_count or 0) + 1

    db.commit()
    db.refresh(review)

    return ReviewResponse(
        id=review.id,
        service_id=review.service_id,
        consumer_id=review.consumer_id,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
        consumer_name=consumer.display_name,
    )


@router.get("/{service_id}", response_model=list[ReviewResponse])
def get_reviews(
    service_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Get reviews for a service."""
    reviews = (
        db.query(Review)
        .filter(Review.service_id == service_id)
        .order_by(Review.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return [
        ReviewResponse(
            id=r.id,
            service_id=r.service_id,
            consumer_id=r.consumer_id,
            rating=r.rating,
            comment=r.comment,
            created_at=r.created_at,
            consumer_name=r.consumer.display_name if r.consumer else None,
        )
        for r in reviews
    ]
