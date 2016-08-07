import template from './build.html';
import controller from './build.controller';
import './build.styl';

export default {
    bindings: {
        build: '='
    },
    template: template,
    bindToController: true,
    controller: controller
};
