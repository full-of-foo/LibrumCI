import angular from 'angular';
import Home from './home/home';
import About from './about/about';
import Repos from './repos/repos';
import Repo from './repo/repo';
import Build from './build/build';

export default angular.module('app.components', [Home, About, Repos, Repo, Build])
    .name;
