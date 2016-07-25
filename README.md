LibrumCI
=======

Deploying to Kubernetes

````
gcloud container clusters create librum-ci --scopes="storage-ro,compute-rw,monitoring,logging-write" --num-nodes 3
gcloud compute disks create --size=200GB mongo-disk
gcloud compute disks create --size=100GB registry-disk
gcloud compute disks create --size=100GB git-repos-disk


// TODO - update
kubectl create -f k8s/ns
kubectl create -f k8s/svc --namespace=librum-ci
kubectl create -f k8s/rc --namespace=librum-ci
kubectl create -f k8s/pv --namespace=librum-ci
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
