export default class HeroController {
    constructor(githooksUrl) {
        'ngInject';

        this.name = 'hero';
        this.githooksUrl = githooksUrl;
    }
}
