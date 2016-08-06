import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import services from './services/services';

angular.module('app', [
    uiRouter,
    Common,
    Components,
    services.name
])
.component('app', AppComponent);
