FROM redpandadata/redpanda:v23.2.1

USER root

COPY start.sh /start.sh

RUN chmod +x /start.sh

USER redpanda

ENTRYPOINT ["/start.sh"]