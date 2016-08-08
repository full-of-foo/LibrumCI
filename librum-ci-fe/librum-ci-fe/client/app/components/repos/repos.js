import angular from 'angular';
import uiRouter from 'angular-ui-router';
import reposComponent from './repos.component';

export default angular.module('repos', [uiRouter])
    .config($stateProvider => {
        'ngInject';
        $stateProvider.state('repos', {url: '/repos', component: 'repos'});
    })
    .component('repos', reposComponent)
    .name;
