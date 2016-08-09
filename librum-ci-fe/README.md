LibrumCI Frontend
=============

## Usage

This service depends upon running librum-ci-master, librum-ci-githooks and mongo instances. All of which
must be ran and orchestrated together (see more [here](./../README.md)).

## Testing

As the frontend functional tests depend upon a web browser they cannot be easily containerised. Test dependencies must be fist installed on one's host machine.
````
cd librum-ci-fe \
  && npm install \
  && npm test
````

## Gulp Tasks
* `webpack`
  * runs Webpack, which will transpile, concatenate, and compress (collectively, "bundle") all assets and modules into `dist/bundle.js`. It also prepares `index.html` to be used as application entry point, links assets and created dist version of our application.
* `serve`
  * starts a dev server via `webpack-dev-server`, serving the client folder.
* `watch`
  * alias of `serve`
* `default` (which is the default task that runs when typing `gulp` without providing an argument)
	* runs `serve`.
* `component`
  * scaffolds a new Angular component.
