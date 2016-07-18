Librum CI Models
==========

Testing
````
docker-compose build && docker-compose run librum-ci-models npm test \
 && docker-compose down
````

Publishing
````
docker-compose build && docker-compose run librum-ci-models /bin/bash -c "npm login && node_modules/.bin/babel -d lib/ src/ && npm publish" \
  && docker-compose down
````
