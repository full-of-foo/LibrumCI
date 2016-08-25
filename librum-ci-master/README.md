LibrumCI Master
==========

Serves the RESTful API for resources and includes a schedule endpoint for build entities. This endpoint uses the k8s API to sequentially schedule the build phase sidecar pods. Using the k8s API each of these running pods will be streamed, where the phase status and logs are captured and persisted for the end user.

## Usage

This service depends upon running librum-ci-githooks and mongo instances. All of which
must be ran and orchestrated together (see more [here](./../README.md)).

## Testing
````
docker-compose build \
 && docker-compose run librum-ci-master test \
 && docker-compose down
````

## Development
````
docker build -t {USER}/librum-ci-master:{TAG} .
docker push {USER}/librum-ci-master
````
