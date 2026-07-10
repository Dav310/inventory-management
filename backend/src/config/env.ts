import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "inventory_management",

  JWT_SECRET: process.env.JWT_SECRET || "",

  KAFKA_BROKER: process.env.KAFKA_BROKER || "",
  KAFKA_USERNAME: process.env.KAFKA_USERNAME || "",
  KAFKA_PASSWORD: process.env.KAFKA_PASSWORD || "",
};