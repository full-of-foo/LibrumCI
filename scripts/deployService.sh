#!/bin/sh
#
# Builds, pushes and (re)deploys a given long-running service to
# one's librum-ci cluster.
# Env variable: SERVICE_NAME (possible values are 'fe', 'master', 'githooks')
# Env variable: REG_USER (the registry where the image lives)
#
# ex:   SERVICE_NAME=fe sh scripts/deployService.sh

: ${REG_USER:=toeknee}

# validate service name
if [ -z "$SERVICE_NAME" ]; then
  echo "SERVICE_NAME not set."
  exit 1
fi
if [[ $SERVICE_NAME != fe && $SERVICE_NAME != master && $SERVICE_NAME != githooks ]] ; then
  echo "Invalid SERVICE_NAME ('$SERVICE_NAME')."
  exit 1
fi

set -x

# Build and push the given serivce,
# then repdeploy the given service's replicationController
# note: using fixed version number for now (until Kuberentes 'deployments' are stable)
cd librum-ci-$SERVICE_NAME \
  && docker build -t $REG_USER/librum-ci-$SERVICE_NAME:0.01 . \
  && docker push $REG_USER/librum-ci-$SERVICE_NAME:0.01 \
  && cd .. \
  && kubectl delete -f k8s/rc/librum-ci-$SERVICE_NAME-rc.yaml --namespace=librum-ci \
  && kubectl create -f k8s/rc/librum-ci-$SERVICE_NAME-rc.yaml --namespace=librum-ci
