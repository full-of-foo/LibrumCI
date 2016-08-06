import template from './repo.html';
import controller from './repo.controller';
import './repo.styl';

let repoComponent = {
    bindings: {
        repos: '='
    },
    template: template,
    bindToController: true,
    controller: controller
};

export default repoComponent;
