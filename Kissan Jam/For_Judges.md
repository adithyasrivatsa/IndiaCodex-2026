# ⚖️ For Judges

Welcome to our submission for India Codex'26! This document outlines the core architecture of **AdaCompute** and specifically addresses how and why we utilized the Cardano blockchain for our decentralized AI marketplace.

## 🔗 The Role of Cardano in AdaCompute

While it may appear that Cardano is simply used to process ADA payments, the blockchain fundamentally alters the architecture of our application, providing four major pillars:

### 1. Passwordless Web3 Identity (Decentralized Auth)
Our platform eliminates traditional "Sign Up" or "Login with Email" flows. The Cardano Wallet acts as a universal, cryptographically secure identity. Users and AI providers are authenticated entirely by their wallet addresses (via the **Mesh SDK**). No centralized database stores sensitive passwords or personal user data.

### 2. Permissionless Global Economy
If we built this with traditional web2 payment gateways (like Stripe), AI providers would require a bank account, an incorporated business, and be located in a supported country. By using Cardano, **anyone in the world with a GPU** can host an AI model, connect their Cardano wallet, and instantly start earning ADA from global consumers. There are no geographical boundaries or banking gatekeepers.

### 3. The Foundation for Trustless Compute (Escrow)
In a traditional Web2 platform, consumers must trust the platform to pay providers, and providers must trust the platform not to withhold funds. In our architecture, Cardano acts as the trust layer. The integration of Cardano allows for **trustless peer-to-peer transfers** directly between the consumer and the AI provider. The ultimate vision utilizes Plutus Smart Contracts to hold the consumer's ADA in escrow, releasing it to the provider *only* when cryptographic proof of AI inference is delivered.

### 4. Decentralizing the AI Monopoly
Currently, the AI industry is dominated by a few massive centralized corporations. AdaCompute leverages Cardano to create a **decentralized marketplace**, allowing independent developers and researchers to compete on an open, transparent protocol where free market dynamics determine the cost of compute.

---

## 🧪 Testing Environment

During the development and testing of this MVP, we utilized the **Lace Wallet** connected to the **Cardano Preprod Testnet**. 

All ADA transactions executed in this demo are on the testnet and utilize test ADA (tADA). The integration is powered by the **Mesh SDK**, which seamlessly bridges our Next.js frontend with the user's Lace browser extension.

*Please review the other documentation files (`Developers.md` and `Implementation_plan.md`) for deeper technical insights!*
