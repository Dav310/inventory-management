# FIFO Inventory Management System

A real-time, event-driven inventory management platform that handles product registration, purchase (buy) and sales (sell) events, and calculates real-time valuations using the First-In-First-Out (FIFO) costing strategy.

---

## 📌 Links to Frontend & Backend

- 🖥️ **Frontend Directory**: [frontend/](file:///e:/Project/inventory-management/frontend) — Contains the React + Vite single-page dashboard app.
- ⚙️ **Backend Directory**: [backend/](file:///e:/Project/inventory-management/backend) — Contains the Express.js API server & Kafka ingestion consumers.
- 📖 **Frontend README**: [frontend/README.md](file:///e:/Project/inventory-management/frontend/README.md)
- 📖 **Backend README**: [backend/README.md](file:///e:/Project/inventory-management/backend/README.md)

---

## 📋 Brief on FIFO Ingestion Logic

The application processes purchases and sales using the **First-In, First-Out (FIFO)** inventory queue strategy to maintain accurate asset valuations and transaction profit margins.

### How it Works:
1. **On Purchase (Buy Event)**:
   - When a purchase transaction is published, a new batch is appended to the `inventory_batch` table.
   - The batch records the `quantity`, `remaining_quantity` (initially equal to quantity), and `unit_price`, tracking exactly when it was received.
2. **On Sale (Sell Event)**:
   - A sale queries active batches where `remaining_quantity > 0`, sorted by `created_at ASC` (ensuring the oldest stock is processed first).
   - The costing engine iterates through the queue, consuming quantities from the oldest batches:
     - If the oldest batch holds more stock than requested, it subtracts the sold amount.
     - If it holds less, the batch is fully consumed (drained to `0`), and the system processes the next oldest active batch until the sale is fulfilled.
   - Cost of Goods Sold (COGS) is calculated dynamically based on the exact purchase rates of the consumed batches, logging profit margins in the `inventory_ledger`.

---

## 🚀 How to Run the Producer Locally

The system includes a local simulator script to publish mock purchase and sales events to the Kafka broker for local testing.

### Prerequisites:
- Ensure PostgreSQL is running and migrations are set up.
- Ensure Redpanda/Kafka docker containers are active.

### Running the Kafka Event Simulator:
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the simulator script:
   ```bash
   npx tsx src/scripts/kafka-simulator.ts
   ```
3. **What this does**:
   - Checks the database for registered products. Seeds a default product `PRD001` if empty.
   - Publishes 6 simulated events to the `inventory-events` topic:
     - 3 purchases (buys) at varying prices (e.g. 10 units at ₹100, 20 units at ₹110, 15 units at ₹120).
     - 3 sales (sells) of varying quantities (e.g. 5, 15, and 10 units), which triggers the FIFO consumption code and calculates exact cogs margins.

---

## 🛠️ Project Services Setup

### Backend Local Run
1. Create a `.env` file in the `backend/` folder (refer to `.env.example`).
2. Run commands:
   ```bash
   cd backend
   pnpm install
   pnpm dev
   ```
   *Server runs at `http://localhost:5000`.*

### Frontend Local Run
1. Create a `.env` file in the `frontend/` folder.
   ```env
   VITE_API_URL=http://localhost:5000
   ```
2. Run commands:
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```
   *Dashboard opens at `http://localhost:5173`.*
