LibrumCI Models
==========

Node package containing the ORM models for 'Repo', 'Branch' and 'Build' entity documents. Utilised by the Githooks and Master web-services.

## Usage
```
# install the node package
npm install librum-ci-models;

# connect to a given mongo instance and query documents
node -e "\
  var db = require('librum-ci-models').db; \
  var Repo = require('librum-ci-models').Repo; \

  db({dbUri: 'mongo/librum-ci:27017'}, function() { \
    Repo.find({}).exec().then(function(repos) { \
      console.log(repos); \
    }); \
  });";
```

## Testing
```
docker-compose build && docker-compose run librum-ci-models npm test \
 && docker-compose down
```

## Publishing
```
docker-compose build && docker-compose run librum-ci-models /bin/bash -c "npm login && node_modules/.bin/babel -d lib/ src/ && npm publish" \
  && docker-compose down
```
