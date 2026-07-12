# 💻 Developers Guide

This document outlines the technical stack, architecture, and core workflows of the **AdaCompute** platform.

## 🏗️ Technical Stack

- **Frontend:** Next.js (App Router), React, TailwindCSS
- **Backend:** Python, FastAPI, SQLite, SQLAlchemy
- **Blockchain Integration:** Mesh SDK (@meshsdk/core, @meshsdk/react)
- **Wallets Supported:** Lace (Tested), Nami, Eternl

## ⚙️ How it Works

### 1. The Marketplace
The Next.js frontend retrieves available AI services from the FastAPI backend. It features dynamic filtering (by category, minimum rating, and maximum price) and provides a glassmorphism-styled UI for users to browse models ranging from lightweight OCR to enterprise-grade Quantum Simulation.

### 2. The Transaction Flow
When a consumer decides to purchase an AI inference:
1. **Wallet Connection:** The user connects their Cardano wallet (e.g., Lace) using Mesh SDK.
2. **Transaction Building:** The frontend builds a transaction specifying the Lovelace amount and the provider's wallet address.
3. **Signing & Submission:** The user signs the transaction via their wallet extension. The Mesh SDK submits it to the Cardano Testnet.
4. **Backend Verification:** Upon successful submission, the frontend hits the backend `/api/purchase` endpoint with the valid `service_id` and consumer address.
5. **Database Execution:** The backend validates the request, logs the transaction in the SQLite database, and returns the mocked AI inference result.

### 3. State Management & Fallbacks
To ensure a smooth demo experience, the frontend includes a robust fallback system (`src/lib/mock-data.ts`). If the backend API is temporarily offline, the frontend seamlessly switches to localized mock data, allowing judges and users to interact with the UI without disruption.

## 🛠️ Running Locally

1. **Backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/Scripts/activate
   pip install -r requirements.txt
   python -m app.seed_data  # Initializes the DB with mock providers/services
   python -m uvicorn app.main:app --reload
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
