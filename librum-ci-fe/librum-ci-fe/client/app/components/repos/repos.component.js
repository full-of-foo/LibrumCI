import template from './repos.html';
import controller from './repos.controller';
import './repos.styl';

export default {
    bindings: {
        repos: '='
    },
    template: template,
    bindToController: true,
    controller: controller
};
