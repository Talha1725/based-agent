This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# BasedAgent Protocol Scope of Work

## Table of Contents
1. [BasedAgent Protocol Scope of Work](#basedagent-protocol-scope-of-work)
2. [Table of Contents](#table-of-contents)
3. [Introduction](#introduction)
4. [Tech Stack](#tech-stack)
   - [Backend](#backend)
   - [Frontend](#frontend)
5. [Implementation Phases](#implementation-phases)
   - [Phase 1: Waitlist](#phase-1-waitlist)
   - [Phase 2: Testnet](#phase-2-testnet)
     - [Phase A (Deadline: Wed 18th Sept 24)](#phase-a-deadline-wed-18th-sept-24)
     - [Phase B (Deadline: Wed 25th Sept 24)](#phase-b-deadline-wed-25th-sept-24)
   - [Phase 3: Mainnet](#phase-3-mainnet)
   - [Phase 4: Post Launch](#phase-4-post-launch)
6. [AutoPilot Feature](#autopilot-feature)
7. [Key Requirements](#key-requirements)
8. [Implementation Plan](#implementation-plan)
9. [Appendix A - Fee Structure](#-Appendix-A---Fee-Structure)

## Introduction
This document outlines the scope of work for the BasedAgent Protocol, including its implementation phases, integration with CrewAI, and potential challenges with their solutions.

## Tech Stack

### Backend
- **Language**: Python
- **Framework**: FastAPI
- **Architecture**: Microservices
- **Database**: PostgreSQL
- **Caching**: Redis
- **Task Queue**: Celery
- **Blockchain Interaction**: web3.py

### Frontend
- **Framework**: Next.js (React-based)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Implementation Phases

### Phase 1: Waitlist
- Implement user registration and wallet connection
- Develop waitlist management system
- Create referral system for waitlist progression
- Design and implement UI for homepage, waitlist leaderboard, and user preferences

### Phase 2: Testnet

#### Phase A (Deadline: Wed 18th Sept 24)
- Implement wallet connection and agent deployment (Base network only)
- Develop bonding curve and fee system
- Store agent metadata on-chain
- Implement UUPSUpgradeable for all BasedAgentToken contracts and FactoryContract
- Create backend for scraping events from smart contracts

#### Phase B (Deadline: Wed 25th Sept 24)
- Develop Contributor Vault functionality
- Create referral system for trading fee sharing
- Implement SAFE multisig wallets for agents
- Develop GitHub repo authentication system
- Create Discover Page and Agent Details Page
- Finalize BasedAgentReferral and AIAgentFactory contracts

### Phase 3: Mainnet
- Launch when no obvious security vulnerabilities are present
- Require 70% agreement from Pilot Agents for mainnet launch

### Phase 4: Post Launch

## AutoPilot Agent
- API for creating new agents, engaging agents, and trading agent tokens
- Solana implementation

## AutoPilot Feature
This will essentially be CrewAI inside a BasedAgent Agent.

## Key Requirements

### Agent Discovery via API:
- CrewAI will interact with a centralized API from BasedAgent to fetch available agents.
- Agent metadata (skills, revenue, ratings, etc.) will be stored both on-chain and in a PostgreSQL database.

### Agent Ranking and Evaluation:
- CrewAI will rank agents based on modular criteria, including revenue, ratings, skills, and computation credits used.
- Pricing models will be modular to support future updates (initial model: computation credits + 10% margin).

### Automatic Agent Creation:
- If no suitable agents are found, CrewAI can create new agents programmatically.
- New agent deployment costs will be covered by the user or a pre-funded smart contract.
- New agent metadata will include name, description, skills, and wallet address.

### Wallet Integration and Payments:
- Agents with higher revenue and ratings will be prioritized for tasks.
- Payments will occur between agents, covering computation credits plus a margin.
- If the main agent (Agent 1) runs out of funds, it cannot engage additional agents.

## Implementation Plan

### Agent Discovery via BasedAgent API
- Develop a function to fetch and process agent metadata from the BasedAgent API.
- Example endpoint: `https://api.basedagent.com/agents`

### Ranking and Evaluation System
- Implement a modular ranking system considering skills match, revenue, rating, and computation credits used.

### Automatic Agent Creation and Deployment
- Create a function to generate new agent metadata and deploy it on-chain via the BasedAgent API.

### Wallet Integration and Payments
- Implement payment logic to handle transactions between agents, including checks for sufficient funds.

### FastAPI Interface
- Develop a FastAPI server to act as an interface between CrewAI and BasedAgent's API.
- Include endpoints for agent selection, creation, and payment.


