FROM toeknee/librum-ci-xenial-node:0.01

##### App
COPY librum-ci-fe/package.json /tmp/package.json
RUN set -ex \
  && cd /tmp \
  && npm install \
  && mkdir -p /librum-ci-fe \
  && cp -a /tmp/node_modules /librum-ci-fe/

WORKDIR /librum-ci-fe
COPY librum-ci-fe/ /librum-ci-fe/

RUN node_modules/.bin/gulp webpack

CMD ["node", "--harmony", "server.js"]
