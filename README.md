# FIFO Inventory Management - Frontend Portal

This is the interactive single-page dashboard application for the FIFO Inventory Management System. It communicates with the backend REST APIs to present stock levels, ledger reports, and dynamic batch breakdowns.

## Features & Visual Modules

- **Live Data Sync**: Implements 3-second auto-polling to keep inventory levels, ledger entries, and KPI cards updated in real-time.
- **Product Stock Overview (Accordion Grouping)**:
  - Lists unique product items with their total remaining stock units, total current valuations, and calculated average cost per unit.
  - Clicking a product row expands an accordion sub-table displaying detailed active batches (Received Time, Unit Price, Original Qty, Remaining Qty, and Value).
  - If a batch or product runs completely out of stock, its indicator turns red.
- **Transaction Ledger Tabs**:
  - Provides two dedicated view tabs for Buy (Purchases) and Sell (Sales).
  - Displays quantities, dates, unit prices, and total margins.
- **Administrative Actions**:
  - Contains reactive tabs to:
    - Register new product codes.
    - Post a new purchase transaction (which generates a Kafka buy event).
    - Post a new sale transaction (which generates a Kafka sell event).
- **Login View**:
  - Secure access control screen with remember-me cookie functionality and an inner-input eye icon toggle to reveal/hide credentials.

---

## Technical Stack

- **Framework**: React.js (Vite + TypeScript)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **HTTP Clients**: Axios
- **Icons**: Lucide React

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

FIFO Inventory Management - Backend API
This is the backend service for the FIFO Inventory Management System. It handles JWT authentication, product registration, buy/sell transactions, and real-time event ingestion using Apache Kafka.
The service calculates inventory costs dynamically using the **First-In-First-Out (FIFO)** queue strategy.

## Key Features

- **Real-time Event Ingestion**: Subscribes to a Kafka topic (`inventory-events`) to process incoming purchase and sale transactions asynchronously.
- **FIFO Costing Logic**: Deducts sales from the oldest available inventory batches and logs the exact transaction margins and remaining valuations.
- **Secure API endpoints**: Protects administrative routes using token-based JWT middleware.
- **Clean Architecture**: Structured using a feature-based modular layout (Auth, Products, Purchases, Sales, Ledger, Inventory, Dashboard).

---

## FIFO Costing Algorithm Explained

The core business logic runs within a database transaction to ensure costing accuracy:

1.  **On Purchase (Buy)**:
    - A purchase event triggers the insertion of a new batch into the `inventory_batch` table.
    - The batch stores `quantity`, `remaining_quantity` (initially equal to quantity), and `unit_price`.
2.  **On Sale**:
    - A sale event queries active batches for the given product code sorted by `created_at ASC` (oldest first).
    - The system consumes inventory from these batches sequentially until the order quantity is fulfilled.
    - If a batch has sufficient units, its `remaining_quantity` is updated. If not, it is set to `0` and the next oldest batch is processed.
    - The cost of goods sold is recorded in the `sales` table based on the original unit prices of the consumed batches.

---

## Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **Database**: PostgreSQL (using raw SQL queries via `pg` pool client)
- **Messaging**: Apache Kafka (using `kafkajs`)

---

## Setup & Local Run

### Prerequisites

- Node.js (v18+)
- pnpm
- PostgreSQL running database instance
- Kafka broker (or Redpanda container)

### 1. Database Setup

Execute the SQL DDL statements inside `src/sql/schema.sql` on your PostgreSQL database instance to set up tables (`users`, `products`, `inventory_batch`, `sales`, `purchases`, `inventory_ledger`).

### 2. Environment Setup

Create a `.env` file in the root backend directory:

### 3. Run Services

Install dependencies and run the server in development watch mode:

```bash
pnpm install
pnpm dev
```

## The server starts at `http://localhost:5000`. It will automatically connect to the PostgreSQL database, establish Kafka consumer connectivity, and create the `inventory-events` topic if it does not already exist.

## API Endpoints Reference

### Authentication

- `POST /api/auth/login` - Authenticate credentials and retrieve a JWT token.

### Dashboard Stats

- `GET /api/dashboard/stats` - Total products, total remaining units, total inventory valuation, and weighted average unit cost.

### Operations

- `GET /api/products` - Query registered inventory items.
- `POST /api/products` - Register a new product code.
- `POST /api/purchases` - Publish a buy transaction event to Kafka.
- `POST /api/sales` - Publish a sell transaction event to Kafka.

### Reports

- `GET /api/inventory` - Fetch active stock batches grouped by product.
- `GET /api/ledger` - Fetch transaction ledger (purchases and sales history).
