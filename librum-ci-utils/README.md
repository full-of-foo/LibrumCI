LibrumCI Utils
======

## Usage
```
docker build -t librum-ci-xenial-node . -f dockerfiles/Dockerfile-xenial-node \
  && docker run librum-ci-xenial-node /bin/sh -c 'node --version' \
  && docker build -t librum-ci-xenial-node-docker . -f dockerfiles/Dockerfile-xenial-node-docker \
  && docker run librum-ci-xenial-node-docker /bin/sh -c 'node --version && docker --version'
```

## Development
```
docker build -t {USER}/librum-ci-xenial-node:{TAG} . -f dockerfiles/Dockerfile-xenial-node \
  && docker push {USER}/librum-ci-xenial-node:{TAG} \
  && docker build -t {USER}/librum-ci-xenial-node-docker:{TAG} . -f dockerfiles/Dockerfile-xenial-node-docer \
  && docker push {USER}/librum-ci-xenial-node-docker:{TAG}
```
