#!/bin/bash
#
# Runs tests for all services and components (git-sync, models, githooks,
# master and fe).
# Note: frontend tests cannot be containerised and require that npm is installed.
#
# ex:   sh scripts/runTests.sh

set -x

cd librum-ci-git-sync \
  && make test \
  && cd ../librum-ci-models \
  && docker-compose build \
  && docker-compose run librum-ci-models npm test \
  && cd .. \
  && docker-compose build \
  && docker-compose run librum-ci-githooks test \
  && docker-compose run librum-ci-master test \
  && docker-compose down \
  && cd librum-ci-fe/librum-ci-fe \
  && (test -d node_modules || npm install) \
  && npm test
