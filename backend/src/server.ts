import "dotenv/config";

import app from "./app.js";
import { pool } from "./config/db.ts";
import { env } from "./config/env.ts";
import { initTopics } from "./kafka/topics.ts";
import { startConsumer } from "./kafka/consumer.ts";

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("🟢 Database connected");
    
    // Initialize Kafka infrastructure
    await initTopics();
    await startConsumer();
    
    app.listen(PORT, () => {
      console.log(`🟢 Server is Running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();
