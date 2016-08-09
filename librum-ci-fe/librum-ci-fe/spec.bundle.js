import angular from 'angular';
import mocks from 'angular-mocks';

const context = require.context('./client/app', true, /\.spec\.js/);
context.keys().forEach(context);
