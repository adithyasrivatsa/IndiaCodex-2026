# AdaCompute — Decentralized AI Service Exchange on Cardano

> **"The financial exchange for AI services"** — Discover, purchase, and use AI services with ADA. Trustless payments, on-chain reputation, escrow-protected transactions.

![Built on Cardano](https://img.shields.io/badge/Built%20on-Cardano-0033AD?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAUCAYAAAC9BQwsAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABcSURBVHgB7ZKxDQAgCAQf7r+CM+AIDuIsuIGLsIGLXEkBJBZa+BXJ8S+QAAAkTeYx1QS4m6c+2FdJL/ARLMkWiCHJAjEkPaQ9pN2f1U/oUb8oJ+tYLmvP8gWr2hljHc+M7AAAAABJRU5ErkJggg==)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)
![Aiken](https://img.shields.io/badge/Aiken-Smart%20Contracts-purple?style=for-the-badge)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│          Cardano Blockchain          │
│  ┌──────────┬──────────┬──────────┐ │
│  │ Registry │  Escrow  │Reputation│ │
│  │ Contract │ Contract │ Contract │ │
│  └──────────┴──────────┴──────────┘ │
└─────────────────────────────────────┘
              │
┌─────────────────────────────────────┐
│        Frontend (Next.js)           │
│  Marketplace · Dashboards · Wallet  │
└─────────────────────────────────────┘
              │
┌─────────────────────────────────────┐
│        Backend (FastAPI)            │
│  REST API · Business Logic · DB    │
└─────────────────────────────────────┘
              │
┌─────────────────────────────────────┐
│   AI Providers (External APIs)      │
│  OCR · Chat · Vision · Translation  │
└─────────────────────────────────────┘
```

---

## ✨ Features

- **AI Marketplace** — Browse 12+ AI services across 11 categories
- **Wallet Authentication** — Connect with Lace, Eternl, Nami, or any CIP-30 wallet
- **Escrow Payments** — ADA locked until service delivery is confirmed
- **On-Chain Reputation** — Immutable provider ratings stored on Cardano
- **Pay-Per-Use** — No subscriptions, pay only for what you use
- **Provider Dashboard** — Revenue analytics, service management, performance metrics
- **Consumer Dashboard** — Purchase history, spending analytics, saved services
- **Real-time Search** — Filter by category, price, rating, and latency

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- npm

### 1. Clone & Setup

```bash
git clone https://github.com/your-org/adacompute.git
cd adacompute
cp .env.example .env
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:3000**

### 3. Backend

```bash
cd backend
pip install -r requirements.txt
python -m app.seed_data        # Populate demo data
uvicorn app.main:app --reload  # Start API server
```

Backend runs at **http://localhost:8000** (API docs at `/docs`)

### 4. (Optional) Docker

```bash
docker-compose up -d
```

This starts PostgreSQL + FastAPI backend.

---

## 📁 Project Structure

```
├── frontend/          Next.js + TailwindCSS + Mesh SDK
│   ├── src/app/       Pages (landing, marketplace, dashboards)
│   ├── src/components/ UI components
│   ├── src/lib/       API client, mock data
│   └── src/types/     TypeScript types
│
├── backend/           FastAPI + SQLAlchemy
│   ├── app/main.py    App entry point
│   ├── app/models/    ORM models (User, Service, Transaction...)
│   ├── app/routers/   API endpoints
│   └── app/schemas/   Pydantic validation
│
├── contracts/         Aiken smart contracts
│   ├── validators/    Registry, Escrow, Reputation
│   └── lib/           Shared types
│
└── docker-compose.yml Docker orchestration
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List services (paginated, filterable) |
| GET | `/api/services/{id}` | Service details |
| POST | `/api/services` | Register new service |
| GET | `/api/categories` | List categories |
| POST | `/api/purchase` | Purchase a service (escrow flow) |
| POST | `/api/reviews` | Submit a review |
| GET | `/api/dashboard/provider` | Provider analytics |
| GET | `/api/dashboard/consumer` | Consumer analytics |
| GET | `/api/transactions` | Transaction history |

---

## 🔗 Smart Contracts (Aiken)

### Registry Contract
Stores service metadata on-chain. Only the owning provider can update or deactivate their listing.

### Escrow Contract
Holds ADA during service execution. Supports Complete, Cancel, and Timeout actions with deadline enforcement.

### Reputation Contract
Immutable on-chain reputation tracking. Only the marketplace authority can update provider scores.

---

## 🎨 Design

- **Theme**: Dark mode with Cardano-inspired palette
- **Colors**: Deep navy (#0D1B2A), Electric blue (#00D1FF), Purple (#A855F7), Green (#00FFA3)
- **Effects**: Glassmorphism, gradient accents, micro-animations
- **Typography**: Inter font family
- **Layout**: Responsive grid, mobile-first

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, TailwindCSS |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Blockchain | Cardano, Mesh SDK, Aiken, Blockfrost |
| Wallet | CIP-30 (Lace, Eternl, Nami) |
| Deployment | Docker, Vercel, Railway |

---

## 📋 Demo Scenario

1. Provider connects Lace wallet
2. Registers OCR service priced at ₳0.5
3. Consumer searches "OCR" in marketplace
4. Consumer selects DocuScan Pro
5. ADA enters escrow smart contract
6. Backend executes AI inference
7. Consumer receives extracted text
8. Smart contract releases payment to provider
9. Consumer leaves a 5-star review
10. Provider reputation updates on-chain

---

## 👥 Team: Kissan Jam

- **Adithya Srivatsa**
- **Karthikeya Kara**
- **Yatish Vutla**

---

## 📄 License

MIT License — Built for the Cardano Hackathon 2026 by Kissan Jam
