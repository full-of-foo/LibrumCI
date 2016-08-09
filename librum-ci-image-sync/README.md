Librum CI Image Sync
==========

TODO - update required env params

Usage
```
docker build -t librum-ci-image-sync . \
  && docker run -v /var/run/docker.sock:/var/run/docker.sock -v $(pwd):/repo -e REPO_DIR=/repo -e DOCKER_HUB_USER=user -e DOCKER_HUB_PASS=secret -e FULL_BUILD_NAME=some-user/repo:123 librum-ci-image-sync
```

Environment Variables
```
REPO_DIR=/linux
DOCKER_HUB_USER=torvalds
DOCKER_HUB_PASS=secret
FULL_BUILD_NAME=torvalds/linux:4.01
```

Development
```
docker build -t {USER}/librum-ci-image-sync:{TAG} . \
  && docker push {USER}/librum-ci-image-sync
```
