-- USER TABLE
CREATE TABLE
  users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- PRODUCT TABLE
CREATE TABLE
  products (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- INVENTORY BATCH
CREATE TABLE
  inventory_batch (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    remaining_quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- SALE
CREATE TABLE
  sales (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- PURCHASES TABLE
CREATE TABLE
  purchases (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- INVENTORY LEDGER TABLE
CREATE TABLE
  inventory_ledger (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'purchase' or 'sale'
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2),
    total_cost DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );