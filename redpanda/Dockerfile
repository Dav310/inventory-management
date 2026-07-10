FROM docker.redpanda.com/redpandadata/redpanda:v23.2.1

COPY start.sh /start.sh

RUN chmod +x /start.sh

ENTRYPOINT ["/start.sh"]