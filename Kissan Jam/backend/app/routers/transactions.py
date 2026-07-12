"""
Transactions API Router — transaction history.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionResponse

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionResponse])
def list_transactions(
    wallet_address: str = Query(...),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """List transactions for a wallet (as consumer or provider)."""
    user = db.query(User).filter(User.wallet_address == wallet_address).first()
    if not user:
        return []

    txs = (
        db.query(Transaction)
        .filter(
            (Transaction.consumer_id == user.id) | (Transaction.provider_id == user.id)
        )
        .order_by(Transaction.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return [
        TransactionResponse(
            id=tx.id,
            service_id=tx.service_id,
            consumer_id=tx.consumer_id,
            provider_id=tx.provider_id,
            amount_ada=tx.amount_ada,
            tx_hash=tx.tx_hash,
            status=tx.status.value if hasattr(tx.status, 'value') else tx.status,
            result_data=tx.result_data,
            created_at=tx.created_at,
            completed_at=tx.completed_at,
            service_name=tx.service.name if tx.service else None,
        )
        for tx in txs
    ]
