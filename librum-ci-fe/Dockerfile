FROM toeknee/librum-ci-xenial-node:0.02

##### App
COPY librum-ci-fe/package.json /tmp/package.json
RUN set -ex \
  && cd /tmp \
  && npm install \
  && mkdir -p /librum-ci-fe /librum-ci-fe/templates /librum-ci-fe/client \
  && cp -a /tmp/node_modules /librum-ci-fe/

WORKDIR /librum-ci-fe

COPY librum-ci-fe/gulp*.js librum-ci-fe/webpack*.js librum-ci-fe/.babelrc /librum-ci-fe/
COPY librum-ci-fe/client/ /librum-ci-fe/client/
RUN node_modules/.bin/gulp webpack

COPY librum-ci-fe/templates/ /librum-ci-fe/templates/
COPY librum-ci-fe/server.js /librum-ci-fe/

RUN rm -fr /librum-ci-fe/client /var/lib/apt/lists/*

CMD ["node", "--harmony", "server.js"]
