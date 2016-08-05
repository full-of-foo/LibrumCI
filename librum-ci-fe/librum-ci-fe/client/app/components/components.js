import angular from 'angular';
import Home from './home/home';
import About from './about/about';
import Repo from './repo/repo';

const componentModule = angular.module('app.components', [Home, About, Repo])
    .name;

export default componentModule;
