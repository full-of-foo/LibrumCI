import angular from 'angular';
import uiRouter from 'angular-ui-router';
import repoComponent from './repo.component';

export default angular.module('repo', [uiRouter])
    .config($stateProvider => {
        "ngInject";
        $stateProvider.state('repo', {url: '/repo/:id', component: 'repo'});
    })
    .component('repo', repoComponent)
    .name;
