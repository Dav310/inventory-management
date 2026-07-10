import "dotenv/config";

import app from "./app.js";
import { pool } from "./config/db.ts";
import { env } from "./config/env.ts";
import { initTopics } from "./kafka/topics.ts";
import { startConsumer } from "./kafka/consumer.ts";

const PORT = env.PORT || 5000;


const startServer = async () => {
  try {
    if (!process.env.VERCEL) {
      await pool.query("SELECT NOW()");
      console.log("🟢 Database connected");
      
      try {
        await initTopics();
        await startConsumer();
      } catch (kafkaError) {
        console.error("⚠️ Kafka initialization failed. Continuing server start...", kafkaError);
      }
      
      app.listen(PORT, () => {
        console.log(`🟢 Server is Running on port ${PORT}`);
      });
    } else {
      console.log("⚡ Running in Vercel Serverless environment");
    }
  } catch (error) {
    console.error("❌ Server initialization failed");
    console.error(error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

startServer();

export default app;
