"""Dashboard schemas — aggregated analytics data."""
from pydantic import BaseModel


class RevenueData(BaseModel):
    date: str
    amount: float


class ProviderDashboard(BaseModel):
    total_revenue_ada: float
    total_requests: int
    total_jobs_completed: int
    avg_latency_ms: int
    success_rate: float
    rating: float
    active_services: int
    revenue_chart: list[RevenueData]


class PurchaseHistory(BaseModel):
    id: str
    service_name: str
    amount_ada: float
    status: str
    date: str


class ConsumerDashboard(BaseModel):
    total_spent_ada: float
    total_purchases: int
    total_reviews: int
    favorite_category: str | None = None
    recent_purchases: list[PurchaseHistory]
