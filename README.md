LibrumCI
=======

Deploying to Kubernetes

````
# K8s 1.2.5 needed (https://cloud.google.com/container-engine/release-notes#july_22_2016)
gcloud container clusters create librum-ci --scopes="storage-ro,compute-rw,monitoring,logging-write" --num-nodes=6
gcloud compute disks create --size=200GB mongo-disk

kubectl create -f k8s/ns
kubectl create secret generic docker-hub-creds --from-literal=docker-hub-user={username} --from-literal=docker-hub-pass={password} --namespace=librum-ci

kubectl create -f k8s/nfs/provisioner/nfs-server-gce-pv.yaml
kubectl create -f k8s/nfs/nfs-server-rc.yaml
kubectl create -f k8s/nfs/nfs-server-svc.yaml
# Update nfs-pv.yaml server with the IP at `kubectl describe services nfs-server --namespace=librum-ci | grep IP:`
kubectl create -f k8s/nfs/nfs-pv.yaml
kubectl create -f k8s/nfs/nfs-pvc.yaml

kubectl create -f k8s/svc
kubectl create -f k8s/rc
````

Local Development
```
docker-compose build && docker-compose up
```

Tearing Down
```
kubectl delete --all pods,svc,rc --namespace=librum-ci
kubectl delete ns librum-ci
```
