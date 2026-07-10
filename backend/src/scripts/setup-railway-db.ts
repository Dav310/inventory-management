import pg from "pg";
const { Client } = pg;

const connectionString = "postgresql://postgres:KzvnKSyKwxMQyNVrMwffHHRoNWWQdCdl@hayabusa.proxy.rlwy.net:36102/railway";

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("🟢 Connected to Railway Postgres!");

    console.log("Creating tables...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(50) UNIQUE NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description TEXT
      );
      
      CREATE TABLE IF NOT EXISTS inventory_batch (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL,
        remaining_quantity INTEGER NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL,
        total_cost DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS purchases (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS inventory_ledger (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(50) NOT NULL,
        transaction_type VARCHAR(20) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10, 2),
        total_cost DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tables verified/created!");

    console.log("Checking admin user...");
    const userCheck = await client.query("SELECT * FROM users WHERE username = $1", ["admin"]);
    if (userCheck.rows.length === 0) {
      console.log("Seeding admin user...");
      await client.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        ["admin", "$2b$10$tM28V6qCqj8Nl4R0HwYl4eS7tH17q12tLz6x/cWMj1V.v/jG.e6Pq"]
      );
      console.log("✅ Admin user seeded (password: admin123)");
    } else {
      console.log("✅ Admin user already exists!");
    }

  } catch (err) {
    console.error("❌ Setup failed:", err);
  } finally {
    await client.end();
  }
}

main();
