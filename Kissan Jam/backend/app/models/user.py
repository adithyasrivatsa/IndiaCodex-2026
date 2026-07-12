"""
User model — wallet-based authentication.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.database import Base


class UserRole(str, enum.Enum):
    CONSUMER = "consumer"
    PROVIDER = "provider"
    BOTH = "both"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    wallet_address: Mapped[str] = mapped_column(
        String(128), unique=True, nullable=False, index=True
    )
    stake_address: Mapped[str | None] = mapped_column(String(128), nullable=True)
    role: Mapped[str] = mapped_column(
        SQLEnum(UserRole), default=UserRole.CONSUMER, nullable=False
    )
    display_name: Mapped[str | None] = mapped_column(String(64), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    bio: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    services = relationship("Service", back_populates="provider", foreign_keys="Service.provider_id")
    reviews = relationship("Review", back_populates="consumer", foreign_keys="Review.consumer_id")
