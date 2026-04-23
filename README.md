# DagFlo — Distributed Job Scheduler & Workflow Engine

> Define your business logic. DagFlo handles the reliability.

DagFlo is a production-grade distributed workflow engine that lets businesses define multi-step processes as DAGs (Directed Acyclic Graphs) and execute them reliably — with automatic retries, crash recovery, real-time monitoring, and schedule-based triggers.


---

## The Problem DagFlo Solves

Every business has multi-step processes:

```
Coffee Shop:   Charge card → Notify warehouse → Send SMS → Add loyalty points
SaaS App:      Create user → Send welcome email → Wait 7 days → Check if logged in → Send reminder
Hospital:      Book appointment → Send confirmation → Wait for report upload → Notify doctor
```

Building these reliably is hard. What happens when:
- The server crashes between step 2 and step 3?
- The warehouse API is temporarily down?
- Two requests try to process the same order simultaneously?
- You need to wait 7 days without keeping a server process alive?

**DagFlo owns all of this.** You define the steps. DagFlo handles everything else.

---

## Architecture

DagFlo is built as a monorepo with three separate Node.js processes and a Next.js dashboard:

```
┌────────────────────────────────────────────────────────────┐
│                        DAGFLO                              │
│                                                            │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │  API Server  │   │    Worker    │   │   Scheduler    │  │
│  │  (Fastify)   │   │  (BullMQ)    │   │  (CronPoller)  │  │
│  │              │   │              │   │                │  │
│  │ • Auth       │   │ • Execute    │   │ • Cron jobs    │  │
│  │ • Workflows  │   │   steps      │   │ • Delayed      │  │
│  │ • Runs       │   │ • DAG        │   │   triggers     │  │
│  │ • Schedules  │   │   resolution │   │                │  │
│  │ • Analytics  │   │ • Retries    │   │                │  │
│  └──────┬───────┘   └──────┬───────┘   └───────┬────────┘  │
│         │                  │                   │           │
│         └──────────────────┼───────────────────┘           │
│                            │                               │
│              ┌─────────────┴─────────────┐                 │
│              │                           │                 │
│    ┌─────────▼──────────┐   ┌────────────▼──────────────┐  │
│    │   BullMQ (Redis)   │   │    PostgreSQL (Neon)      │  │
│    │   The Ticket Board │   │    The Filing Cabinet     │  │
│    └────────────────────┘   └───────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Three Separate Processes

| Process | Responsibility |
|---|---|
| **API Server** | Receives HTTP requests, manages CRUD, serves dashboard |
| **Worker** | Executes steps, handles retries, resolves DAG |
| **Scheduler** | Watches the clock, triggers cron-based workflows |

This separation means API traffic spikes never delay job execution, and a crashed worker never brings down the API.

---

## Key Technical Decisions

### DAG Validation — Cycle Detection via DFS

Before any workflow is saved, DagFlo runs a **Depth-First Search** with three-color marking (WHITE/GRAY/BLACK) to detect cycles. If Step A depends on Step B which depends on Step A — DagFlo catches this at save time, not execution time.

### Deterministic Step Execution — Distributed Locking

When running multiple Worker instances, two workers must never execute the same step simultaneously (double charge problem). DagFlo uses **Redis SETNX with TTL** to acquire an atomic lock before every step execution. If a worker crashes mid-execution, the TTL releases the lock after 30 seconds.

### Immutable Workflow Versioning

Every workflow edit creates a new `WorkflowVersion` record — the original is never mutated. This means:
- Full audit trail of every change
- Running jobs use the version they started with
- Instant rollback to any previous configuration

### Multi-Layer Caching

```
Layer 1 → In-memory LRU (sub-millisecond)
Layer 2 → Redis (milliseconds)
Layer 3 → PostgreSQL (source of truth)
```

Workflow definitions are cached aggressively. Cache is invalidated via Redis pub/sub when any version changes.

### Exponential Backoff Retry

Failed steps are retried with exponential backoff using BullMQ's delayed queue:
```
Attempt 1 fails → retry after 2 seconds
Attempt 2 fails → retry after 4 seconds
Attempt 3 fails → permanently failed, run marked FAILED
```

---

## Tech Stack

### Backend
| Layer | Technology | Why |
|---|---|---|
| Runtime | Node.js + TypeScript | Type safety across the entire codebase |
| API Framework | Express | Battle-tested, familiar patterns |
| Database | PostgreSQL (Neon) | Relational integrity, JSONB for DAG storage |
| ORM | Prisma 7 | Type-safe queries, schema-first design |
| Queue | BullMQ on Redis | Job state tracking, delayed retries, visibility |
| Cache + Locks | Redis (ioredis) | In-memory speed, atomic SETNX for distributed locks |
| Validation | Zod | Schema-first validation, TypeScript integration |
| HTTP Client | Axios | Used in HttpStepHandler for step execution |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| State | Zustand + TanStack Query |
| Real-time | WebSockets (live run updates) |
| Styling | Tailwind CSS |

### Infrastructure
| Tool | Purpose |
|---|---|
| Docker Compose | Local Redis setup |
| Neon | Serverless PostgreSQL |
| npm Workspaces | Monorepo management |

---

## Project Structure

```
DagFlo/
├── apps/
│   ├── api/                    → Express API server
│   │   └── src/
│   │       ├── index.ts        → Server entry point
│   │       ├── shared/
│   │       │   ├── middlewares/ → authenticate, validate, errorHandler
│   │       │   ├── models/      → TypeScript interfaces
│   │       │   └── utils/       → AppError, responseFormatter, prisma, dagValidator
│   │       └── services/
│   │           ├── auth/        → register, login
│   │           ├── workflows/   → CRUD + DAG validation
│   │           ├── runs/        → trigger, cancel, retry
│   │           ├── schedules/   → cron schedule management
│   │           └── analytics/   → metrics and insights
│   │
│   ├── worker/                 → BullMQ job execution engine
│   │   └── src/
│   │       ├── engine/          → WorkflowExecutor, StepExecutor, DagResolver, RetryManager, StateManager
│   │       ├── queue/           → consumer, producer, config
│   │       ├── lock/            → DistributedLock (Redis SETNX)
│   │       ├── handlers/        → HttpStepHandler, WaitStepHandler
│   │       └── utils/           → prisma, redis
│   │
│   ├── scheduler/              → Cron trigger process
│   │   └── src/
│   │       ├── CronPoller.ts    → polls PostgreSQL every 60s
│   │       ├── TriggerDispatcher.ts → creates runs, pushes to BullMQ
│   │       └── utils/
│   │
│   └── web/                    → Next.js dashboard
│       ├── app/
│       │   ├── (auth)/          → register, login
│       │   ├── dashboard/       → overview metrics
│       │   ├── workflows/       → workflow management
│       │   ├── runs/            → run monitoring
│       │   └── schedules/       → schedule management
│       └── components/
│
├── packages/
│   └── sdk-js/                 → @dagflo/sdk npm package
│       └── src/
│           ├── DagFloClient.ts  → main entry point
│           ├── TriggerClient.ts → handles run triggering
│           ├── WorkflowBuilder.ts → fluent workflow definition API
│           ├── CircuitBreaker.ts → handles API downtime gracefully
│           └── types/
│
├── prisma/
│   ├── schema.prisma           → all 7 table definitions
│   └── migrations/
│
└── docker-compose.yml          → spins up Redis locally
```

---

## Data Models

```
Bizowner          → the person who signs up on DagFlo
WorkflowMain      → the workflow container (name, owner, active status)
WorkflowVersion   → immutable DAG snapshots (steps stored as JSONB)
JobRun            → one execution of a workflow
StepRun           → one step within a job run
Schedule          → cron-based trigger definition
ApiKey            → authentication key for SDK usage
```

### Relationship Overview
```
Bizowner
  └── WorkflowMain (many)
        ├── WorkflowVersion (many, immutable)
        ├── JobRun (many)
        │     └── StepRun (many)
        └── Schedule (many)
```

---

## Getting Started

### Prerequisites

```
Node.js 18+
Docker Desktop (for Redis)
A Neon account (free tier works)
```

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/dagflo.git
cd dagflo
npm install
```

### 2. Environment Setup

Create `.env` files in each app:

**apps/api/.env**
```
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

**apps/worker/.env**
```
DATABASE_URL=your_neon_connection_string
REDIS_HOST=localhost
REDIS_PORT=6379
```

**apps/scheduler/.env**
```
DATABASE_URL=your_neon_connection_string
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Start Redis

```bash
docker-compose up -d
```

### 4. Set Up Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start All Three Processes

```bash
# Terminal 1 — API Server
cd apps/api
npx tsx src/index.ts

# Terminal 2 — Worker
cd apps/worker
npx tsx src/index.ts

# Terminal 3 — Scheduler
cd apps/scheduler
npx tsx src/index.ts

# Terminal 4 — Dashboard
cd apps/web
npm run dev
```

---

## Using the SDK

```bash
npm install @dagflo/sdk
```

```typescript
import { DagFloClient } from "@dagflo/sdk"

const dagflo = new DagFloClient({
    apiKey: "your_api_key",
    baseUrl: "https://your-dagflo-instance.com"
})

// Trigger a workflow run
const run = await dagflo.trigger("process-order", {
    orderId: "ord_999",
    amount: 500
})

console.log(run.runId) // "run_xyz789"

// Check run status
const status = await dagflo.getRunStatus(run.runId)
console.log(status.status) // "RUNNING"

// Define a workflow in code
await dagflo.workflow("process-order")
    .step("validate", { type: "http", url: "https://api.yourapp.com/validate", method: "POST" })
    .step("charge", { type: "http", url: "https://api.yourapp.com/charge", method: "POST" }).dependsOn("validate")
    .step("notify", { type: "http", url: "https://api.yourapp.com/notify", method: "POST" }).dependsOn("charge")
    .register()
```

---

## API Reference

### Authentication
```
POST /api/auth/register    → create account
POST /api/auth/login       → get JWT token
POST /api/auth/logout      → clear session
```

### Workflows
```
POST   /api/workflows           → create workflow
GET    /api/workflows           → list all workflows
GET    /api/workflows/:id       → get workflow by id
PUT    /api/workflows/:id       → update workflow (creates new version)
DELETE /api/workflows/:id       → delete workflow
```

### Runs
```
POST   /api/runs/:id/trigger    → trigger a workflow run
GET    /api/runs/:id            → get all runs for a workflow
GET    /api/runs/:id/detail     → get one specific run with step statuses
POST   /api/runs/:id/cancel     → cancel a running job
POST   /api/runs/:id/retry      → retry a failed run
```

### Schedules
```
POST   /api/schedules           → create a cron schedule
GET    /api/schedules           → list all schedules
DELETE /api/schedules/:id       → delete a schedule
PUT    /api/schedules/:id/pause → pause a schedule
PUT    /api/schedules/:id/resume → resume a schedule
```

---

## How A Run Executes

```
1. Bizowner triggers run via dashboard or SDK
2. API creates JobRun record (PENDING) and StepRun records for all steps
3. API identifies steps with no dependencies → pushes to BullMQ
4. Worker picks up job from BullMQ queue
5. Worker acquires Redis distributed lock (prevents duplicate execution)
6. Worker updates StepRun → RUNNING
7. HttpStepHandler makes the actual HTTP call
8. On success → Worker updates StepRun → FINISHED, saves output
9. DAG Resolver checks which steps are now unblocked
10. Worker pushes newly unblocked steps to BullMQ
11. On failure → RetryManager checks retry count
12. If retries remaining → push back to queue with exponential backoff delay
13. If no retries → StepRun → FAILED, JobRun → FAILED
14. When all steps FINISHED → JobRun → FINISHED
15. WebSocket pushes live updates to dashboard throughout
```

## License

MIT
