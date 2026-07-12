# 🗺️ Implementation Plan & Vision

## 💡 The Core Idea
**AdaCompute** aims to democratize access to artificial intelligence by breaking the monopoly of centralized cloud providers. By utilizing the Cardano blockchain, we have designed a peer-to-peer marketplace where anyone with idle compute power can host AI models, and consumers can seamlessly pay for inference using ADA.

## 🚀 Current Implementation (MVP)
For the India Codex'26 hackathon, we have successfully implemented:
1. **Interactive UI:** A highly polished Next.js application that allows users to discover, filter, and compare AI services.
2. **Wallet Integration:** Cardano wallet connectivity utilizing the Mesh SDK, strictly tested with the Lace wallet.
3. **P2P ADA Payments:** Functioning transaction builders that facilitate direct Lovelace transfers on the Cardano Preprod Testnet from consumers to mock AI providers.
4. **Backend Architecture:** A scalable Python FastAPI backend to track consumer spending, manage provider catalogs, and simulate AI inference results.

## 🔮 Future Roadmap (Beyond MVP)

### Phase 1: Smart Contract Escrow (Plutus)
Transitioning from peer-to-peer transfers to a trustless escrow system. Consumer ADA will be locked in a Plutus v3 smart contract and only released to the provider upon cryptographic verification that the AI inference was successfully executed and delivered.

### Phase 2: Live AI Model Integration
Connecting the FastAPI backend to real, localized open-source models (like Llama 3, Stable Diffusion, and Whisper) to replace the current simulated mock responses. 

### Phase 3: Provider Node Client
Developing a lightweight desktop client that allows independent GPU owners to easily connect their hardware to the AdaCompute network, automatically fulfilling inference requests and earning ADA in the background.

### Phase 4: Decentralized Reputation System
Implementing an on-chain review and rating system where consumer reviews are linked directly to cryptographic proof of purchase, eliminating fake reviews and ensuring high-quality compute providers rise to the top of the marketplace.
