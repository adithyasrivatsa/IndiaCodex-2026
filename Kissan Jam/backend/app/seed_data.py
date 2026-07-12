"""
Seed data script — populates the database with demo AI services.
Run: python -m app.seed_data
"""
import random
from datetime import datetime, timezone, timedelta
from app.database import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.category import Category
from app.models.service import Service, ServiceStatus
from app.models.transaction import Transaction, TransactionStatus
from app.models.review import Review


def seed():
    """Populate database with realistic demo data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Clear existing data
        db.query(Review).delete()
        db.query(Transaction).delete()
        db.query(Service).delete()
        db.query(Category).delete()
        db.query(User).delete()
        db.commit()

        # ── Categories ──────────────────────────────────────────
        categories_data = [
            {"name": "Chat", "slug": "chat", "description": "Conversational AI and chatbots", "icon": "💬", "color": "#00D1FF"},
            {"name": "OCR", "slug": "ocr", "description": "Optical Character Recognition", "icon": "📄", "color": "#FF6B6B"},
            {"name": "Vision", "slug": "vision", "description": "Image analysis and computer vision", "icon": "👁️", "color": "#A855F7"},
            {"name": "Speech-to-Text", "slug": "speech-to-text", "description": "Audio transcription services", "icon": "🎤", "color": "#F59E0B"},
            {"name": "Translation", "slug": "translation", "description": "Multi-language translation", "icon": "🌐", "color": "#10B981"},
            {"name": "Summarization", "slug": "summarization", "description": "Text and document summarization", "icon": "📝", "color": "#3B82F6"},
            {"name": "Coding", "slug": "coding", "description": "Code generation and assistance", "icon": "💻", "color": "#8B5CF6"},
            {"name": "Image Generation", "slug": "image-generation", "description": "AI image creation and editing", "icon": "🎨", "color": "#EC4899"},
            {"name": "Video", "slug": "video", "description": "Video analysis and processing", "icon": "🎬", "color": "#EF4444"},
            {"name": "Audio", "slug": "audio", "description": "Audio processing and classification", "icon": "🔊", "color": "#06B6D4"},
            {"name": "Document AI", "slug": "document-ai", "description": "Intelligent document processing", "icon": "📋", "color": "#14B8A6"},
        ]
        categories = {}
        for cat_data in categories_data:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
            categories[cat.slug] = cat

        # ── Providers ───────────────────────────────────────────
        providers_data = [
            {"wallet_address": "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjqp", "display_name": "VisionAI Labs", "role": UserRole.PROVIDER, "bio": "Leading computer vision solutions on Cardano"},
            {"wallet_address": "addr_test1qpq6xvd07ftxj3k8u6epzhf70h4nxz7jf6z7h0cz8qd5svgcmvks6eqfzj6v4yjmprk8x9f8rs57zgt3j5n3p7pxf3qknhwrj", "display_name": "NeuralForge", "role": UserRole.PROVIDER, "bio": "Democratizing AI with decentralized compute"},
            {"wallet_address": "addr_test1qr0c3frkem9cqn5f73dnvqpena27k2fgqew6wct9eaka03agfwkvzr0zyq7nqvcj24zehrshx63zzdxv24x3a4tcnfeq9zwmn7", "display_name": "LinguaTech", "role": UserRole.PROVIDER, "bio": "NLP and translation services for the world"},
            {"wallet_address": "addr_test1qq4h47rtu8ek3cv0r3jrj69q3nxklwvvhz9t0h8n0v6v4qqwkd7dv0kchxz6j6c5j2q3s7zw3vhc8dmxhg4prhs0d7sqycj5m7", "display_name": "DeepAudio AI", "role": UserRole.PROVIDER, "bio": "State-of-the-art audio and speech processing"},
            {"wallet_address": "addr_test1vqwvs32x3wg5ea2l5tr7t93hpta8arwxllr4ey96dhl5d7sytaf9n", "display_name": "PixelMind", "role": UserRole.PROVIDER, "bio": "Creative AI powered by Cardano"},
            {"wallet_address": "addr_test1qrxhyr2flena4ams5pcx26n0yj4ttpmjq2tmuesu4waw8n0qkvxuy9e5e5zy6tmkkkm5egj2228eua9avrt6gk4st4tuqkr6m52", "display_name": "CodeForge AI", "role": UserRole.PROVIDER, "bio": "AI-powered code generation and review"},
        ]
        providers = {}
        for p_data in providers_data:
            provider = User(**p_data)
            db.add(provider)
            db.flush()
            providers[p_data["display_name"]] = provider

        # ── Services ────────────────────────────────────────────
        services_data = [
            {
                "provider": "VisionAI Labs",
                "category": "ocr",
                "name": "DocuScan Pro",
                "description": "Enterprise-grade OCR powered by a fine-tuned vision transformer. Supports 50+ languages, handwriting recognition, table extraction, and structured data output. Ideal for invoice processing, form digitization, and document archiving.",
                "short_description": "Enterprise OCR with 50+ language support",
                "price_ada": 2.5,
                "endpoint_url": "https://api.visionai.labs/v2/ocr",
                "avg_latency_ms": 1200,
                "success_rate": 99.3,
                "total_jobs": 9547,
                "rating": 4.92,
                "review_count": 234,
                "model_name": "DocuVision-T5-Large",
                "version": "2.1.0",
                "tags": "ocr,document,invoice,handwriting,table",
                "example_input": '{"image_url": "https://example.com/invoice.png", "language": "en", "format": "json"}',
                "example_output": '{"text": "Invoice #12345...", "confidence": 0.98, "tables": [...]}',
            },
            {
                "provider": "NeuralForge",
                "category": "chat",
                "name": "ForgeChat 70B",
                "description": "A conversational AI model built on Llama 3 70B, fine-tuned for multi-turn dialogue, code generation, and reasoning tasks. Supports system prompts, function calling, and streaming responses. OpenAI-compatible API.",
                "short_description": "Llama 3 70B chat model with function calling",
                "price_ada": 6.0,
                "endpoint_url": "https://api.neuralforge.io/v1/chat/completions",
                "avg_latency_ms": 2100,
                "success_rate": 99.8,
                "total_jobs": 45230,
                "rating": 4.87,
                "review_count": 1023,
                "model_name": "ForgeChat-70B-v3",
                "version": "3.0.0",
                "tags": "chat,llm,reasoning,code,function-calling",
                "example_input": '{"messages": [{"role": "user", "content": "Explain quantum computing"}], "max_tokens": 500}',
                "example_output": '{"choices": [{"message": {"content": "Quantum computing leverages..."}}]}',
            },
            {
                "provider": "VisionAI Labs",
                "category": "vision",
                "name": "ObjectDetect Ultra",
                "description": "Real-time object detection API using YOLOv9. Detects 1000+ object categories with bounding boxes, confidence scores, and segmentation masks. Optimized for security, retail analytics, and autonomous systems.",
                "short_description": "YOLOv9-powered real-time object detection",
                "price_ada": 2.8,
                "endpoint_url": "https://api.visionai.labs/v2/detect",
                "avg_latency_ms": 450,
                "success_rate": 99.5,
                "total_jobs": 28340,
                "rating": 4.95,
                "review_count": 567,
                "model_name": "YOLOv9-Ultra",
                "version": "1.5.0",
                "tags": "vision,detection,yolo,segmentation,security",
                "example_input": '{"image_url": "https://example.com/street.jpg", "threshold": 0.5}',
                "example_output": '{"detections": [{"label": "car", "confidence": 0.98, "bbox": [120, 45, 380, 290]}]}',
            },
            {
                "provider": "DeepAudio AI",
                "category": "speech-to-text",
                "name": "WhisperMax",
                "description": "Production-ready speech-to-text powered by Whisper V3 Large. Supports 99 languages, speaker diarization, punctuation restoration, and word-level timestamps. Handles audio up to 4 hours long.",
                "short_description": "Whisper V3 Large with speaker diarization",
                "price_ada": 3.5,
                "endpoint_url": "https://api.deepaudio.ai/v1/transcribe",
                "avg_latency_ms": 3200,
                "success_rate": 98.9,
                "total_jobs": 12780,
                "rating": 4.78,
                "review_count": 321,
                "model_name": "Whisper-V3-Large",
                "version": "3.2.1",
                "tags": "speech,transcription,whisper,diarization,multilingual",
                "example_input": '{"audio_url": "https://example.com/meeting.mp3", "language": "auto", "diarize": true}',
                "example_output": '{"text": "Speaker 1: Welcome to the meeting...", "segments": [...]}',
            },
            {
                "provider": "LinguaTech",
                "category": "translation",
                "name": "PolyGlot 200",
                "description": "Neural machine translation supporting 200+ language pairs. Preserves context, handles idioms, and supports document-level translation. Built on a custom encoder-decoder architecture with 13B parameters.",
                "short_description": "200+ language pairs with context preservation",
                "price_ada": 2.2,
                "endpoint_url": "https://api.linguatech.ai/v2/translate",
                "avg_latency_ms": 800,
                "success_rate": 99.7,
                "total_jobs": 67890,
                "rating": 4.89,
                "review_count": 1456,
                "model_name": "PolyGlot-13B",
                "version": "2.0.0",
                "tags": "translation,multilingual,nmt,document",
                "example_input": '{"text": "Hello, world!", "source": "en", "target": "ja"}',
                "example_output": '{"translation": "こんにちは、世界！", "confidence": 0.97}',
            },
            {
                "provider": "LinguaTech",
                "category": "summarization",
                "name": "BriefAI",
                "description": "Intelligent text summarization for documents, articles, and reports. Supports extractive and abstractive summarization with adjustable length. Handles documents up to 100K tokens.",
                "short_description": "Extractive & abstractive summarization",
                "price_ada": 5.0,
                "endpoint_url": "https://api.linguatech.ai/v1/summarize",
                "avg_latency_ms": 1500,
                "success_rate": 99.1,
                "total_jobs": 23450,
                "rating": 4.72,
                "review_count": 445,
                "model_name": "BriefAI-7B",
                "version": "1.3.0",
                "tags": "summarization,text,document,extractive,abstractive",
                "example_input": '{"text": "Long article text...", "max_length": 200, "style": "abstractive"}',
                "example_output": '{"summary": "The article discusses...", "compression_ratio": 0.15}',
            },
            {
                "provider": "CodeForge AI",
                "category": "coding",
                "name": "CodePilot Pro",
                "description": "AI coding assistant supporting 30+ programming languages. Generates code from natural language, performs code review, bug detection, refactoring suggestions, and documentation generation. Built on a custom 34B code model.",
                "short_description": "30+ language code generation and review",
                "price_ada": 4.5,
                "endpoint_url": "https://api.codeforge.ai/v2/generate",
                "avg_latency_ms": 1800,
                "success_rate": 99.6,
                "total_jobs": 34560,
                "rating": 4.91,
                "review_count": 789,
                "model_name": "CodePilot-34B",
                "version": "2.5.0",
                "tags": "coding,code-generation,review,refactoring,documentation",
                "example_input": '{"prompt": "Write a Python function to sort a list", "language": "python"}',
                "example_output": '{"code": "def sort_list(lst):\\n    return sorted(lst)", "explanation": "..."}',
            },
            {
                "provider": "PixelMind",
                "category": "image-generation",
                "name": "DreamForge XL",
                "description": "State-of-the-art image generation powered by Stable Diffusion XL with custom LoRA fine-tuning. Supports text-to-image, image-to-image, inpainting, and outpainting. 4K resolution output available.",
                "short_description": "SDXL-powered image generation with 4K output",
                "price_ada": 5.0,
                "endpoint_url": "https://api.pixelmind.art/v1/generate",
                "avg_latency_ms": 8500,
                "success_rate": 97.8,
                "total_jobs": 156780,
                "rating": 4.85,
                "review_count": 2341,
                "model_name": "DreamForge-XL-v2",
                "version": "2.0.0",
                "tags": "image,generation,sdxl,art,creative",
                "example_input": '{"prompt": "A futuristic city at sunset", "size": "1024x1024", "steps": 30}',
                "example_output": '{"image_url": "https://cdn.pixelmind.art/gen/abc123.png", "seed": 42}',
            },
            {
                "provider": "DeepAudio AI",
                "category": "audio",
                "name": "SoundSense",
                "description": "Audio analysis and classification API. Identifies music genres, environmental sounds, emotions in speech, and audio quality metrics. Supports batch processing and real-time streaming.",
                "short_description": "Audio classification and emotion detection",
                "price_ada": 2.6,
                "endpoint_url": "https://api.deepaudio.ai/v1/classify",
                "avg_latency_ms": 1100,
                "success_rate": 98.5,
                "total_jobs": 8920,
                "rating": 4.65,
                "review_count": 178,
                "model_name": "SoundSense-L",
                "version": "1.2.0",
                "tags": "audio,classification,emotion,music,speech",
                "example_input": '{"audio_url": "https://example.com/clip.wav", "tasks": ["genre", "emotion"]}',
                "example_output": '{"genre": "jazz", "emotion": "happy", "quality_score": 0.92}',
            },
            {
                "provider": "NeuralForge",
                "category": "document-ai",
                "name": "DocuMind",
                "description": "Intelligent document processing pipeline. Combines OCR, NER, table extraction, and document classification into a single API. Outputs structured JSON. Handles PDFs, images, and scanned documents.",
                "short_description": "End-to-end intelligent document processing",
                "price_ada": 4.0,
                "endpoint_url": "https://api.neuralforge.io/v1/document",
                "avg_latency_ms": 4500,
                "success_rate": 98.2,
                "total_jobs": 5670,
                "rating": 4.73,
                "review_count": 134,
                "model_name": "DocuMind-v2",
                "version": "2.0.0",
                "tags": "document,ocr,ner,table,classification",
                "example_input": '{"document_url": "https://example.com/report.pdf", "extract": ["tables", "entities"]}',
                "example_output": '{"pages": 5, "tables": [...], "entities": [...], "classification": "report"}',
            },
            {
                "provider": "PixelMind",
                "category": "video",
                "name": "FrameAI",
                "description": "Video analysis API for scene detection, object tracking, action recognition, and content moderation. Processes videos up to 2 hours. Supports real-time streaming analysis for surveillance and media.",
                "short_description": "Scene detection and object tracking in video",
                "price_ada": 6.0,
                "endpoint_url": "https://api.pixelmind.art/v1/video/analyze",
                "avg_latency_ms": 12000,
                "success_rate": 96.5,
                "total_jobs": 3240,
                "rating": 4.58,
                "review_count": 89,
                "model_name": "FrameAI-v1",
                "version": "1.0.0",
                "tags": "video,tracking,scene,action,moderation",
                "example_input": '{"video_url": "https://example.com/clip.mp4", "tasks": ["scenes", "objects"]}',
                "example_output": '{"duration": "02:34", "scenes": 4, "objects_tracked": 12}',
            },
            {
                "provider": "NeuralForge",
                "category": "chat",
                "name": "ForgeChat 8B Fast",
                "description": "Lightweight conversational AI optimized for speed. Based on Llama 3 8B with aggressive quantization. Perfect for chatbots, customer support, and quick Q&A. Sub-500ms latency.",
                "short_description": "Fast Llama 3 8B for low-latency chat",
                "price_ada": 1.5,
                "endpoint_url": "https://api.neuralforge.io/v1/chat/fast",
                "avg_latency_ms": 380,
                "success_rate": 99.9,
                "total_jobs": 234500,
                "rating": 4.76,
                "review_count": 3456,
                "model_name": "ForgeChat-8B-Q4",
                "version": "1.2.0",
                "tags": "chat,fast,llm,lightweight,support",
                "example_input": '{"messages": [{"role": "user", "content": "What is Cardano?"}]}',
                "example_output": '{"choices": [{"message": {"content": "Cardano is a proof-of-stake blockchain..."}}]}',
            },
            {
                "provider": "CodeForge AI",
                "category": "coding",
                "name": "Neural Quantum Simulator",
                "description": "Simulate complex quantum circuits using distributed AI nodes. Enterprise access.",
                "short_description": "Enterprise quantum simulation",
                "price_ada": 1000.0,
                "endpoint_url": "https://api.codeforge.ai/v2/quantum",
                "avg_latency_ms": 250000,
                "success_rate": 99.9,
                "total_jobs": 50,
                "rating": 5.0,
                "review_count": 5,
                "model_name": "QuantumSim-Pro",
                "version": "1.0.0",
                "tags": "quantum,simulation,enterprise",
                "example_input": '{"circuit_url": "s3://q-circuits/test.qasm"}',
                "example_output": '{"state_vector": [...], "probabilities": [...]}',
            },
            {
                "provider": "VisionAI Labs",
                "category": "vision",
                "name": "Global Weather Predictor AI",
                "description": "Generate ultra-high resolution climate models and weather predictions over a 10-year period.",
                "short_description": "Global high-res weather modeling",
                "price_ada": 2500.0,
                "endpoint_url": "https://api.visionai.labs/v3/climate",
                "avg_latency_ms": 600000,
                "success_rate": 99.9,
                "total_jobs": 10,
                "rating": 4.9,
                "review_count": 3,
                "model_name": "ClimateVision-X",
                "version": "1.0.0",
                "tags": "climate,weather,vision,modeling",
                "example_input": '{"region": "global", "timeline_years": 10}',
                "example_output": '{"forecast_data_url": "s3://climate/result.nc"}',
            },
        ]

        for s_data in services_data:
            provider = providers[s_data.pop("provider")]
            category = categories[s_data.pop("category")]
            service = Service(
                provider_id=provider.id,
                category_id=category.id,
                status=ServiceStatus.ACTIVE,
                **s_data,
            )
            db.add(service)

        # ── Demo Consumer ───────────────────────────────────────
        consumer = User(
            wallet_address="addr_test1qz97wnce3xhg7vxrfhp2j5xkw8yj2v35szdz6vs7j6ckjxfmkzr8c2e3yknlt3knkjf3ycmx0fy24hf4gk5t3z9phfs0r3e8m",
            display_name="DemoUser",
            role=UserRole.CONSUMER,
            bio="Exploring decentralized AI services",
        )
        db.add(consumer)

        db.commit()
        print("✅ Database seeded successfully!")
        print(f"   • {len(categories_data)} categories")
        print(f"   • {len(providers_data)} providers")
        print(f"   • {len(services_data)} services")
        print(f"   • 1 demo consumer")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
