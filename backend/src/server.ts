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
      
      await initTopics();
      await startConsumer();
      
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
