Librum CI Git Sync
=========

(Forked from: https://github.com/kubernetes/contrib)

````
export GOPATH=$(pwd)
cd $GOPATH/src/k8s.io/contrib/git-sync
godep save ./...

make clean binary

docker build -t {USER}/librum-ci-git-sync:{TAG} .
docker push {USER}/librum-ci-git-sync:{TAG}
````
