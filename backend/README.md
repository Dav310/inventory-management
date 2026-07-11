# FIFO Inventory Management - Backend API

This is the backend service for the FIFO Inventory Management System. It handles JWT authentication, product registration, buy/sell transactions, and real-time event ingestion using Apache Kafka.
The service calculates inventory costs dynamically using the **First-In-First-Out (FIFO)** costing strategy.

---

## 📌 Project Links

- 🖥️ **Frontend Directory**: [frontend/](file:///e:/Project/inventory-management/frontend) — Contains the React + Vite single-page dashboard app.
- ⚙️ **Backend Directory**: [backend/](file:///e:/Project/inventory-management/backend) — Contains the Express.js API server & Kafka ingestion consumers.
- 📖 **Root README**: [README.md](file:///e:/Project/inventory-management/README.md)
- 📖 **Frontend README**: [frontend/README.md](file:///e:/Project/inventory-management/frontend/README.md)

---

## 📋 Brief on FIFO Ingestion Logic

The backend service processes inventory transactions using the **First-In, First-Out (FIFO)** strategy:

1. **On Purchase (Buy)**:
   - Appends a new inventory batch record inside the `inventory_batch` table.
   - Tracks `quantity`, `remaining_quantity` (starts at quantity), and purchase `unit_price`, ordered by creation timestamp.
2. **On Sale (Sell)**:
   - Fetches active batches for the given product code sorted by `created_at ASC` (oldest first).
   - Iterates through the list, deducting the sold stock quantity from the oldest batches:
     - If the oldest batch has sufficient stock, its `remaining_quantity` is updated.
     - If not, it is fully depleted to `0`, and the remainder is deducted from the next oldest batch.
   - Calculates Cost of Goods Sold (COGS) dynamically according to the actual batch unit rates and logs profit margins.

---

## 🚀 How to Run the Producer Locally

A Kafka producer simulator script is provided in `src/scripts/kafka-simulator.ts` to test event publishing and FIFO consumption queues locally.

### Executing the Producer Simulator:
1. Open a terminal and change to the `backend/` directory.
2. Execute the simulator:
   ```bash
   npx tsx src/scripts/kafka-simulator.ts
   ```
3. **What this does**:
   - Seed product `PRD001` if the database is empty.
   - Sends 6 mock event messages (3 purchases, 3 sales) to the `inventory-events` Kafka topic to populate transaction history and test FIFO updates.

---

## 🛠️ Local Running Guide

### 1. Prerequisites
- Node.js (v18+)
- pnpm
- PostgreSQL database instance
- Kafka broker (e.g. Redpanda running in Docker)

### 2. Database Schema
Apply DDL query setups from `src/sql/schema.sql` onto your database to initialize necessary tables.

### 3. Start Development Server
```bash
pnpm install
pnpm dev
```
*Server runs at `http://localhost:5000`.*
