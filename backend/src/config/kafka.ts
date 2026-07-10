import { Kafka, KafkaConfig } from "kafkajs";
import { env } from "./env.ts";

const kafkaConfig: KafkaConfig = {
  clientId: "inventory-management",
  brokers: (env.KAFKA_BROKER || "localhost:9092").split(","),
};
console.log("Kafka Broker:", env.KAFKA_BROKER); 

if (env.KAFKA_USERNAME && env.KAFKA_PASSWORD) {
  kafkaConfig.ssl = true;
  kafkaConfig.sasl = {
    mechanism: "scram-sha-256",
    username: env.KAFKA_USERNAME,
    password: env.KAFKA_PASSWORD,
  };
}

export const kafka = new Kafka(kafkaConfig);