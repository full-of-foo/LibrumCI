FROM toeknee/librum-ci-xenial-node:0.02
LABEL Description="Development image (test execution and package publishing) for the LibrumCI models package"

##### App
COPY librum-ci-models/package.json /tmp/package.json
RUN set -ex \
  && cd /tmp \
  && npm install \
  && mkdir -p /librum-ci-models \
  && cp -a /tmp/node_modules /librum-ci-models/

WORKDIR /librum-ci-models
COPY librum-ci-models/ /librum-ci-models/
