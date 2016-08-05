cd /Users/anthonytroy/Documents/research/practicum/LibrumCI/librum-ci-master
docker build -t toeknee/librum-ci-master:0.01 . \
  && docker push toeknee/librum-ci-master:0.01 \
  && cd /Users/anthonytroy/Documents/research/practicum/LibrumCI \
  && kubectl delete -f k8s/rc/librum-ci-master-rc.yaml --namespace=librum-ci \
  && kubectl create -f k8s/rc/librum-ci-master-rc.yaml --namespace=librum-ci
