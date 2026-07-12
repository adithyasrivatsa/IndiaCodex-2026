"""
Purchase API Router — handles the escrow → inference → release flow.
"""
import uuid
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import get_settings
from app.models.service import Service
from app.models.user import User
from app.models.transaction import Transaction, TransactionStatus
from app.models.escrow import Escrow, EscrowStatus
from app.schemas.transaction import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/purchase", tags=["purchase"])

settings = get_settings()


@router.post("", response_model=TransactionResponse, status_code=201)
def initiate_purchase(payload: TransactionCreate, db: Session = Depends(get_db)):
    """
    Initiate a purchase:
    1. Verify service exists
    2. Find/create consumer
    3. Create transaction + escrow record
    4. Simulate AI inference
    5. Release escrow
    """
    # 1. Get service
    service = db.query(Service).filter(Service.id == payload.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    # 2. Find or create consumer
    consumer = db.query(User).filter(User.wallet_address == payload.consumer_wallet).first()
    if not consumer:
        consumer = User(wallet_address=payload.consumer_wallet, role="consumer")
        db.add(consumer)
        db.flush()

    # 3. Create transaction
    tx = Transaction(
        service_id=service.id,
        consumer_id=consumer.id,
        provider_id=service.provider_id,
        amount_ada=service.price_ada,
        tx_hash=f"mock_tx_{uuid.uuid4().hex[:16]}",
        status=TransactionStatus.ESCROW,
    )
    db.add(tx)
    db.flush()

    # 4. Create escrow
    escrow = Escrow(
        transaction_id=tx.id,
        consumer_id=consumer.id,
        provider_id=service.provider_id,
        service_id=service.id,
        amount_ada=service.price_ada,
        status=EscrowStatus.LOCKED,
        timeout_at=datetime.now(timezone.utc) + timedelta(seconds=settings.ESCROW_TIMEOUT_SECONDS),
    )
    db.add(escrow)

    # 5. Simulate inference (in production, this calls the provider endpoint)
    simulated_result = _simulate_inference(service, payload.input_data)

    # 6. Release escrow
    escrow.status = EscrowStatus.RELEASED
    escrow.released_at = datetime.now(timezone.utc)
    tx.status = TransactionStatus.COMPLETED
    tx.result_data = simulated_result
    tx.completed_at = datetime.now(timezone.utc)

    # 7. Update service metrics
    service.total_jobs += 1

    db.commit()
    db.refresh(tx)

    return TransactionResponse(
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
        service_name=service.name,
    )


def _simulate_inference(service: Service, input_data: str | None) -> str:
    """Simulate AI model inference for demo purposes."""
    category = service.category.slug if service.category else "general"
    simulations = {
        "ocr": "Extracted text: 'Invoice #12345 — Total: $2,450.00 — Date: 2026-07-12 — Vendor: Acme Corp'",
        "chat": "Hello! I'm an AI assistant powered by AdaCompute. I can help you with a wide range of tasks including answering questions, writing code, and creative tasks. How can I help you today?",
        "vision": "Detected objects: [car (98.2%), traffic_light (95.1%), person (92.8%), bicycle (88.4%)]",
        "speech-to-text": "Transcribed audio: 'Welcome to AdaCompute, the decentralized AI service exchange built on Cardano.'",
        "translation": "Translation (EN→ES): 'Bienvenido a AdaCompute, el intercambio descentralizado de servicios de IA construido sobre Cardano.'",
        "summarization": "Summary: AdaCompute is a decentralized marketplace enabling AI service providers to publish models and APIs, allowing users to discover and purchase them using ADA cryptocurrency on the Cardano blockchain.",
        "coding": "```python\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint([fibonacci(i) for i in range(10)])\n# Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n```",
        "image-generation": "Generated image URL: https://ada-compute.io/generated/img_a7f3b2c1.png (1024x1024, style: photorealistic)",
        "video": "Video analysis complete: Duration 02:34, 4 scenes detected, dominant colors: blue, white, green.",
        "audio": "Audio classification: Speech (92%), Music (5%), Noise (3%). Language: English. Sentiment: Positive.",
        "document-ai": "Document parsed: 3 pages, 2 tables extracted, 1 signature detected, classification: Invoice.",
    }
    return simulations.get(category, f"AI inference completed successfully for service '{service.name}'. Input processed: {input_data or 'N/A'}")


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: str, db: Session = Depends(get_db)):
    """Get transaction details."""
    tx = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return TransactionResponse(
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
