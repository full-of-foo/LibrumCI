FROM toeknee/librum-ci-xenial-node:0.01

##### App
COPY librum-ci-githooks/package.json /tmp/package.json
RUN set -ex \
  && cd /tmp \
  && npm install \
  && mkdir -p /librum-ci-githooks \
  && cp -a /tmp/node_modules /librum-ci-githooks/

WORKDIR /librum-ci-githooks
COPY librum-ci-githooks/ /librum-ci-githooks/

COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["app"]
