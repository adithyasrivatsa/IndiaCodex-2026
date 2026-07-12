"""
Escrow model — holds ADA in escrow during service execution.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
import enum

from app.database import Base


class EscrowStatus(str, enum.Enum):
    LOCKED = "locked"
    RELEASED = "released"
    REFUNDED = "refunded"
    TIMED_OUT = "timed_out"


class Escrow(Base):
    __tablename__ = "escrows"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    transaction_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("transactions.id"), nullable=False, unique=True
    )
    consumer_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False
    )
    provider_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False
    )
    service_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("services.id"), nullable=False
    )
    amount_ada: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(
        SQLEnum(EscrowStatus), default=EscrowStatus.LOCKED, nullable=False
    )
    timeout_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    released_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
