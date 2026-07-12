"""
Service model — represents an AI service listed on the marketplace.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.database import Base


class ServiceStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    PENDING = "pending"


class Service(Base):
    __tablename__ = "services"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    provider_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    category_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("categories.id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    short_description: Mapped[str | None] = mapped_column(String(256), nullable=True)
    price_ada: Mapped[float] = mapped_column(Float, nullable=False)
    endpoint_url: Mapped[str] = mapped_column(String(512), nullable=False)
    docs_url: Mapped[str | None] = mapped_column(String(512), nullable=True)

    # Performance metrics
    avg_latency_ms: Mapped[int] = mapped_column(Integer, default=0)
    success_rate: Mapped[float] = mapped_column(Float, default=100.0)
    total_jobs: Mapped[int] = mapped_column(Integer, default=0)
    uptime: Mapped[float] = mapped_column(Float, default=100.0)

    # Rating
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)

    # Metadata
    version: Mapped[str] = mapped_column(String(32), default="1.0.0")
    model_name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    example_input: Mapped[str | None] = mapped_column(Text, nullable=True)
    example_output: Mapped[str | None] = mapped_column(Text, nullable=True)
    tags: Mapped[str | None] = mapped_column(String(512), nullable=True)  # comma-separated

    status: Mapped[str] = mapped_column(
        SQLEnum(ServiceStatus), default=ServiceStatus.ACTIVE, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    provider = relationship("User", back_populates="services", foreign_keys=[provider_id])
    category = relationship("Category", back_populates="services")
    reviews = relationship("Review", back_populates="service")
    transactions = relationship("Transaction", back_populates="service")
