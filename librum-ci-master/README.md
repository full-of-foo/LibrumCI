LibrumCI Master
==========

Usage

This service depends upon running librum-ci-githooks and mongo instances. All of which
must be ran and orchestrated together (see more [here](./../README.md)).

Testing
````
docker-compose build \
 && docker-compose run librum-ci-master test \
 && docker-compose down
````

Development
````
docker build -t {USER}/librum-ci-master:{TAG} .
docker push {USER}/librum-ci-master
````
