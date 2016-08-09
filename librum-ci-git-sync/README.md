LibrumCI Git Sync
=========

```
The Copyright for this forked software remains "AS IS".
 - Source modification: https://github.com/full-of-foo/LibrumCI/commit/fc04563d1bb6e700ae03bfb0cc545dac6c947c26#diff-147c5a53fb447b68b36b1b356b366f99
 - Forked from: https://github.com/kubernetes/contrib/tree/master/git-sync
```

git-sync is a command that pull a git repository to a local directory. It can be used to source a container volume with the content of a git repo

## Usage
```
make \
  && docker build -t librum-ci-git-sync . \
  && docker run -e GIT_SYNC_REPO=https://github.com/rails/cache_digests -e GIT_SYNC_DEST=/tmp -e GIT_SYNC_BRANCH=master librum-ci-git-sync -rev HEAD
```

## Environment Variables
```
GIT_SYNC_REPO=https://github.com/torvalds/linux
GIT_SYNC_DEST=/linux
GIT_SYNC_BRANCH=release/4.1
GIT_SYNC_REV=HEAD
GIT_SYNC_ONE_TIME=true
```

## Development
```
make \
  && docker build -t {USER}/librum-ci-git-sync:{TAG} . \
  && docker push {USER}/librum-ci-git-sync:{TAG}
```
