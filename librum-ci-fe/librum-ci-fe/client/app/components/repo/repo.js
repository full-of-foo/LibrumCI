import angular from 'angular';
import uiRouter from 'angular-ui-router';
import repoComponent from './repo.component';

let repoModule = angular.module('repo', [uiRouter])
    .config(($stateProvider) => {
        "ngInject";
        $stateProvider.state('repo', {url: '/repo', component: 'repo'});
    })
    .component('repo', repoComponent)
    .name;

export default repoModule;
