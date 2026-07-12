"""
Category model for AI service categories.
"""
import uuid
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(256), nullable=True)
    icon: Mapped[str] = mapped_column(String(32), default="🤖")
    color: Mapped[str] = mapped_column(String(7), default="#00D1FF")

    # Relationships
    services = relationship("Service", back_populates="category")
