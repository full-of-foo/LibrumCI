LibrumCI GitHooks
==========

Usage

This service depends upon running librum-ci-master and mongo instances. All of which
must be ran and orchestrated together (see more [here](./../README.md)).

Testing
````
docker-compose build \
 && docker-compose run librum-ci-githooks test \
 && docker-compose down
````

Development
````
docker build -t {USER}/librum-ci-githooks:{TAG} .
docker push {USER}/librum-ci-githooks
````
