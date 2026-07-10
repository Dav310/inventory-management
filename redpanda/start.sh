#!/bin/sh

exec redpanda start \
  --overprovisioned \
  --smp=1 \
  --memory=512M \
  --reserve-memory=0M \
  --node-id=0 \
  --kafka-addr=PLAINTEXT://0.0.0.0:29092,OUTSIDE://0.0.0.0:9092 \
  --advertise-kafka-addr=PLAINTEXT://redpanda:29092,OUTSIDE://redpanda:9092