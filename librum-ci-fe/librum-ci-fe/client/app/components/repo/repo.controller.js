export default class RepoController {
    constructor(repoResource, $stateParams) {
        "ngInject";

        this.repo = {};
        this.repoResource = repoResource;
        this.repoResource.get($stateParams.id)
            .then(res => {
                this.repo = res.data;
            })
            .catch(err => this.error = err);
    }
}
