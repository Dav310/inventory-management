import { kafka } from "../config/kafka.ts";

export const TOPIC_INVENTORY_EVENTS = "inventory-events";

export const initTopics = async () => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    console.log("🟢 Kafka Admin connected");
    const topics = await admin.listTopics();
    if (!topics.includes(TOPIC_INVENTORY_EVENTS)) {
      await admin.createTopics({
        topics: [
          {
            topic: TOPIC_INVENTORY_EVENTS,
            numPartitions: 1,
          },
        ],
      });
      console.log(`🟢 Kafka Topic "${TOPIC_INVENTORY_EVENTS}" created successfully.`);
    } else {
      console.log(`🟢 Kafka Topic "${TOPIC_INVENTORY_EVENTS}" already exists.`);
    }
  } catch (error) {
    console.error("❌ Failed to initialize Kafka topics:", error);
  } finally {
    await admin.disconnect();
    console.log("🔴 Kafka Admin disconnected");
  }
};
