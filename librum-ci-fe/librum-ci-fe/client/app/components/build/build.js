import angular from 'angular';
import uiRouter from 'angular-ui-router';
import buildComponent from './build.component';

export default angular.module('build', [uiRouter])
    .config($stateProvider => {
        'ngInject';
        $stateProvider.state('build', {url: '/build/:id', component: 'build'});
    })
    .component('build', buildComponent)
    .name;
