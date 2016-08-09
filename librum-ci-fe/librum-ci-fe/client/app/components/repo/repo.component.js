import template from './repo.html';
import controller from './repo.controller';

export default {
    bindings: {
        repo: '='
    },
    template: template,
    bindToController: true,
    controller: controller
};
