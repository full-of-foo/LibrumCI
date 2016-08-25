LibrumCI GitHooks
==========

Responsible for listening to Github push events (contributions). Upon receiving a contribution from a preconfigured repository, it will persist the contribution data (commit SHA, branch name, etc.), create a new build record and then request that the given build be scheduled via the LibrumCI Master API.

## Usage

This service depends upon running librum-ci-master and mongo instances. All of which
must be ran and orchestrated together (see more [here](./../README.md)).

## Testing
````
docker-compose build \
 && docker-compose run librum-ci-githooks test \
 && docker-compose down
````

## Development
````
docker build -t {USER}/librum-ci-githooks:{TAG} .
docker push {USER}/librum-ci-githooks
````
