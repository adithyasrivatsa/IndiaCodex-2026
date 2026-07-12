"""
Dashboard API Router — aggregated analytics for providers and consumers.
"""
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user import User
from app.models.service import Service
from app.models.transaction import Transaction, TransactionStatus
from app.models.review import Review
from app.schemas.dashboard import (
    ProviderDashboard, ConsumerDashboard, RevenueData, PurchaseHistory,
)

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/provider", response_model=ProviderDashboard)
def provider_dashboard(wallet_address: str = Query(...), db: Session = Depends(get_db)):
    """Get provider analytics dashboard data."""
    user = db.query(User).filter(User.wallet_address == wallet_address).first()
    if not user:
        return ProviderDashboard(
            total_revenue_ada=0.0,
            total_requests=0,
            total_jobs_completed=0,
            avg_latency_ms=0,
            success_rate=100.0,
            rating=0.0,
            active_services=0,
            revenue_chart=[
                RevenueData(date=(datetime.now(timezone.utc) - timedelta(days=i)).strftime("%b %d"), amount=0.0)
                for i in range(6, -1, -1)
            ],
        )

    # Total revenue
    total_revenue = (
        db.query(func.sum(Transaction.amount_ada))
        .filter(
            Transaction.provider_id == user.id,
            Transaction.status == TransactionStatus.COMPLETED,
        )
        .scalar() or 0.0
    )

    # Total requests
    total_requests = (
        db.query(func.count(Transaction.id))
        .filter(Transaction.provider_id == user.id)
        .scalar() or 0
    )

    # Completed jobs
    completed_jobs = (
        db.query(func.count(Transaction.id))
        .filter(
            Transaction.provider_id == user.id,
            Transaction.status == TransactionStatus.COMPLETED,
        )
        .scalar() or 0
    )

    # Average latency from services
    avg_latency = (
        db.query(func.avg(Service.avg_latency_ms))
        .filter(Service.provider_id == user.id)
        .scalar() or 0
    )

    # Success rate
    success_rate = (completed_jobs / total_requests * 100) if total_requests > 0 else 100.0

    # Average rating
    avg_rating = (
        db.query(func.avg(Service.rating))
        .filter(Service.provider_id == user.id, Service.rating > 0)
        .scalar() or 0.0
    )

    # Active services count
    active_services = (
        db.query(func.count(Service.id))
        .filter(Service.provider_id == user.id, Service.status == "active")
        .scalar() or 0
    )

    # Revenue chart (last 7 days)
    revenue_chart = []
    for i in range(6, -1, -1):
        day = datetime.now(timezone.utc) - timedelta(days=i)
        day_str = day.strftime("%b %d")
        day_revenue = (
            db.query(func.sum(Transaction.amount_ada))
            .filter(
                Transaction.provider_id == user.id,
                Transaction.status == TransactionStatus.COMPLETED,
                func.date(Transaction.created_at) == day.date(),
            )
            .scalar() or 0.0
        )
        revenue_chart.append(RevenueData(date=day_str, amount=round(float(day_revenue), 2)))

    return ProviderDashboard(
        total_revenue_ada=round(float(total_revenue), 2),
        total_requests=total_requests,
        total_jobs_completed=completed_jobs,
        avg_latency_ms=int(avg_latency),
        success_rate=round(success_rate, 1),
        rating=round(float(avg_rating), 2),
        active_services=active_services,
        revenue_chart=revenue_chart,
    )


@router.get("/consumer", response_model=ConsumerDashboard)
def consumer_dashboard(wallet_address: str = Query(...), db: Session = Depends(get_db)):
    """Get consumer dashboard data."""
    user = db.query(User).filter(User.wallet_address == wallet_address).first()
    if not user:
        return ConsumerDashboard(
            total_spent_ada=0.0,
            total_purchases=0,
            total_reviews=0,
            favorite_category=None,
            recent_purchases=[],
        )

    total_spent = (
        db.query(func.sum(Transaction.amount_ada))
        .filter(
            Transaction.consumer_id == user.id,
            Transaction.status == TransactionStatus.COMPLETED,
        )
        .scalar() or 0.0
    )

    total_purchases = (
        db.query(func.count(Transaction.id))
        .filter(Transaction.consumer_id == user.id)
        .scalar() or 0
    )

    total_reviews = (
        db.query(func.count(Review.id))
        .filter(Review.consumer_id == user.id)
        .scalar() or 0
    )

    # Recent purchases
    recent_txs = (
        db.query(Transaction)
        .filter(Transaction.consumer_id == user.id)
        .order_by(Transaction.created_at.desc())
        .limit(10)
        .all()
    )

    recent_purchases = [
        PurchaseHistory(
            id=tx.id,
            service_name=tx.service.name if tx.service else "Unknown",
            amount_ada=tx.amount_ada,
            status=tx.status.value if hasattr(tx.status, 'value') else tx.status,
            date=tx.created_at.strftime("%Y-%m-%d %H:%M"),
        )
        for tx in recent_txs
    ]

    return ConsumerDashboard(
        total_spent_ada=round(float(total_spent), 2),
        total_purchases=total_purchases,
        total_reviews=total_reviews,
        favorite_category=None,
        recent_purchases=recent_purchases,
    )
