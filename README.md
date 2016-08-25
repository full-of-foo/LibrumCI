LibrumCI
=======

A proof of concept CI system that
effectively supports fully-containerised CI workflows
through leveraging the native features of Cluster Management frameworks.


## Deployment
LibrumCI currently supports running on top of a Kubernetes (k8s) cluster.

As deploying a k8s cluster from scratch is not trivial, we advise you use Google Container Engine (IaaS) to do this heavy lifting for you. Its also [free](https://cloud.google.com/container-engine/pricing#pricing_for_cluster_management)!

````
# Create a k8s cluster (or use an existing one)
gcloud container clusters create librum-ci --scopes="storage-ro,compute-rw,monitoring,logging-write" --num-nodes=6
# Provision some persistent disk storage
gcloud compute disks create --size=200GB mongo-disk

# Create the librum-ci namespace
kubectl create -f k8s/ns
# Create a secret to persist Docker Hub credentials for staging build artefacts
kubectl create secret generic docker-hub-creds --from-literal=docker-hub-user={username} --from-literal=docker-hub-pass={password} --namespace=librum-ci

# Provision and create a NFS volume to persist our repositories in
kubectl create -f k8s/nfs/provisioner/nfs-server-gce-pv.yaml
# Create the NFS replication controller and service
kubectl create -f k8s/nfs/nfs-server-rc.yaml
kubectl create -f k8s/nfs/nfs-server-svc.yaml
# Update the NFS persistent volume (nfs-pv.yaml) server with the IP at `kubectl describe services nfs-server --namespace=librum-ci | grep IP:`
# Create the NFS persistent volume and claim
kubectl create -f k8s/nfs/nfs-pv.yaml
kubectl create -f k8s/nfs/nfs-pvc.yaml

# Create the LibrumCI services and replication controlers
kubectl create -f k8s/svc
kubectl create -f k8s/rc
````

## Local Development
```
docker-compose build && docker-compose up
```

## Testing
```
sh scripts/runTests.sh
```

## Tearing Down
```
kubectl delete --all pods,svc,rc,pv,pvc --namespace=librum-ci
kubectl delete ns librum-ci
```
