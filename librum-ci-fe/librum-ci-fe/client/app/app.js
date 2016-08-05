import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';

angular.module('app', [uiRouter, Common,Components])
    .config($locationProvider => {
        "ngInject";
        $locationProvider.html5Mode(true).hashPrefix('!');
    })
    .component('app', AppComponent);
