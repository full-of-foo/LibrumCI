import angular from 'angular';
import uiRouter from 'angular-ui-router';
import newRepoComponent from './newRepo.component';

export default angular.module('newRepo', [uiRouter])
    .config($stateProvider => {
        'ngInject';
        $stateProvider.state('newRepo', {url: '/newRepo', component: 'newRepo'});
    })
    .component('newRepo', newRepoComponent)
    .name;
