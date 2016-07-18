FROM toeknee/librum-ci-xenial-node:0.01

##### App
COPY librum-ci-master/package.json /tmp/package.json
RUN set -ex \
  && cd /tmp \
  && npm install \
  && mkdir -p /librum-ci-master \
  && cp -a /tmp/node_modules /librum-ci-master/

WORKDIR /librum-ci-master
COPY librum-ci-master/ /librum-ci-master/

COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["app"]
