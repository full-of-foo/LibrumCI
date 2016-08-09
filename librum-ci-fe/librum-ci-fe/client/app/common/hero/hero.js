import angular from 'angular';
import uiRouter from 'angular-ui-router';
import heroComponent from './hero.component';

export default angular.module('hero', [uiRouter])
    .component('hero', heroComponent)
    .name;;
