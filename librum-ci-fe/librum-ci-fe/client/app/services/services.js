import angular from 'angular';
import repoResource from './repoResource';
import buildResource from './buildResource';

export default angular
    .module('app.services', [])
    .service({
        repoResource,
        buildResource
    });
