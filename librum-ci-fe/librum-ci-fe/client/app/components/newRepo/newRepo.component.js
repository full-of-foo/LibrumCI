import template from './newRepo.html';
import controller from './newRepo.controller';

export default {
    bindings: {
        repo: '='
    },
    template: template,
    bindToController: true,
    controller: controller
};
