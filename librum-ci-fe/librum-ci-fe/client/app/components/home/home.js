import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';

export default angular.module('home', [uiRouter])
    .config(($stateProvider, $urlRouterProvider) => {
        'ngInject';

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {url: '/',component: 'home'});
    })
    .component('home', homeComponent)
    .name;
