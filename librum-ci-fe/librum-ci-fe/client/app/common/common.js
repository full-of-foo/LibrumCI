import angular from 'angular';
import Navbar from './navbar/navbar';
import Hero from './hero/hero';

export default angular.module('app.common', [Navbar, Hero])
    .name;
