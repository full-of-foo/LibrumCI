export default class NewRepoController {
    constructor(repoResource, $location) {
        'ngInject';

        this.newRepo = {};
        this.repoResource = repoResource;
        this.$location = $location;
    }

    save() {
        this.isSaving = true;
        this.repoResource.post(this.newRepo)
            .then(res => {
                this.newRepo = res.data;
                this.$location.path(`/#/repo/${this.newRepo._id}`);
            })
            .catch(err => this.error = err)
            .finally(() => this.isSaving = false);
    }
}
