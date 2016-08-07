import template from './repo.html';
import controller from './repo.controller';
import './repo.styl';

export default {
    bindings: {
        repo: '='
    },
    template: template,
    bindToController: true,
    controller: controller
};
