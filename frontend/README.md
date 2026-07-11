# FIFO Inventory Management - Frontend Portal

This is the interactive single-page dashboard application for the FIFO Inventory Management System. It communicates with the backend REST APIs to present stock levels, ledger reports, and dynamic batch breakdowns.

---

## 📌 Project Links

- 🖥️ **Frontend Directory**: [frontend/](file:///e:/Project/inventory-management/frontend) — Contains the React + Vite single-page dashboard app.
- ⚙️ **Backend Directory**: [backend/](file:///e:/Project/inventory-management/backend) — Contains the Express.js API server & Kafka ingestion consumers.
- 📖 **Root README**: [README.md](file:///e:/Project/inventory-management/README.md)
- 📖 **Backend README**: [backend/README.md](file:///e:/Project/inventory-management/backend/README.md)

---

## 📋 Brief on FIFO Ingestion Logic

The frontend presents real-time data calculated by the backend using a **First-In, First-Out (FIFO)** costing strategy:
- **Active Inventory Batches**: Groups remaining stock batches by product. The accordion displays the oldest batches on top (which will be consumed first when a sale is published).
- **Valuations**: Total product value is the sum of value across all remaining active batches (`remaining_quantity * unit_price`).
- **Costing**: In ledger history, sales unit cost is dynamically computed as an average of the actual purchase rates of the stock batches depleted.

---

## 🚀 How to Run the Producer Locally

To simulate transaction events and see real-time updates reflect on the frontend dashboard:
1. Open a terminal in the backend directory.
2. Run the simulator script:
   ```bash
   npx tsx src/scripts/kafka-simulator.ts
   ```
3. The simulator posts 3 buy and 3 sell events, which will immediately update the frontend graphs, ledger tabs, and active batches cards in real-time.

---

## Features & Visual Modules

*   **Live Data Sync**: Implements 3-second auto-polling to keep inventory levels, ledger entries, and KPI cards updated in real-time.
*   **Product Stock Overview (Accordion Grouping)**: 
    *   Lists unique product items with their total remaining stock units, total current valuations, and calculated average cost per unit.
    *   Clicking a product row expands an accordion sub-table displaying detailed active batches (Received Time, Unit Price, Original Qty, Remaining Qty, and Value).
    *   If a batch or product runs completely out of stock, its indicator turns red.
*   **Transaction Ledger Tabs**: 
    *   Provides two dedicated view tabs for Buy (Purchases) and Sell (Sales).
    *   Displays quantities, dates, unit prices, and total margins.
*   **Administrative Actions**:
    *   Contains reactive tabs to:
        *   Register new product codes.
        *   Post a new purchase transaction (which generates a Kafka buy event).
        *   Post a new sale transaction (which generates a Kafka sell event).
*   **Login View**:
    *   Secure access control screen with remember-me cookie functionality and an inner-input eye icon toggle to reveal/hide credentials.

---

## Technical Stack
*   **Framework**: React.js (Vite + TypeScript)
*   **Styling**: Tailwind CSS
*   **Forms**: React Hook Form
*   **HTTP Clients**: Axios
*   **Icons**: Lucide React

---

## Setup & Running Locally

### 1. Environment Setup
Create a `.env` file in the root frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

### 2. Install and Start

Run the following commands:

```bash
pnpm install
pnpm dev
```

The frontend portal will start at `http://localhost:5173`. Ensure the backend server is running so that API requests resolve correctly.
