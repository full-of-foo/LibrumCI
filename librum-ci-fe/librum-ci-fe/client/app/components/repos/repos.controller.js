class ReposController {
    constructor(repoResource) {
        'ngInject';

        this.repos = [];
        this.repoResource = repoResource;
        this.repoResource.getAll()
            .then(res => {
                this.repos = res.data;
            })
            .catch(err => this.error = err);
    }
}

export default ReposController;
