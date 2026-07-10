import { kafka } from "../config/kafka.ts";

const producer = kafka.producer();

let isConnected = false;

export const connectProducer = async () => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("🟢 Kafka Producer connected");
  }
};

export const disconnectProducer = async () => {
  if (isConnected) {
    await producer.disconnect();
    isConnected = false;
    console.log("🔴 Kafka Producer disconnected");
  }
};

export const publishEvent = async (topic: string, event: object) => {
  await connectProducer();
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(event),
      },
    ],
  });
};
