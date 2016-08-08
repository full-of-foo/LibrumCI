import template from './newRepo.html';
import controller from './newRepo.controller';
import './newRepo.styl';

export default {
    bindings: {
        newRepo: '='
    },
    template: template,
    bindToController: true,
    controller: controller
};
