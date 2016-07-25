Librum CI Image Sync
==========

Usage
```
docker build -t test . && docker run -v /var/run/docker.sock:/var/run/docker.sock -v $(pwd):/repo -e REPO_DIR=/repo -e REPO_NAME=image-sync-test -e BUILD_ID=123 test
```

Development
````
docker build -t ${USER}/librum-ci-image-sync:${TAG} .
docker push ${USER}/librum-ci-image-sync
````
