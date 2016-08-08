export default class BuildController {
    constructor(buildResource, $stateParams) {
        'ngInject';

        this.build = {};
        this.buildResource = buildResource;
        this.buildResource.get($stateParams.id)
            .then(res => {
                this.build = res.data;
            })
            .catch(err => this.error = err);
    }
}
