export default class NewRepoController {
    constructor(repoResource, $location) {
        'ngInject';

        this.repo = {envVars: [{key: '', value: ''}]};
        this.repoResource = repoResource;
        this.$location = $location;
        this.isUpdating = this.$location.search().isUpdating;

        if (this.isUpdating) {
            this.repoResource.get(this.isUpdating)
                .then(res => {
                    this.repo = res.data;
                    if (this.repo.envVars.length === 0) this.repo.envVars = [{key:'', value:''}];
                })
                .catch(err => this.error = err);
        }
    }

    _saveOrUpdate(requestPromise) {
        this.isSaving = true;
        return requestPromise
            .then(res => {
                this.repo = res.data;
                // TODO - fix redirect (goes to /)
                this.$location.path(`/#/repo/${this.repo._id}`);
            })
            .catch(err => {
                this.error = err;
                this.repo = {envVars: [{key: '', value: ''}]};
            })
            .finally(() => this.isSaving = false);
    }

    _cleanData() {
        const filteredVars = this.repo.envVars.filter((e, i) => e && e.key && this.repo.envVars.indexOf(e) === i);
        this.repo.envVars = filteredVars.map(envVar => {
            envVar.key = envVar.key.toUpperCase();
            return envVar;
        });
        if (!this.repo.slug && !this.repo.slug.trim()) this.repo.slug = null;
        if (!this.repo.dockerRunCommand && !this.repo.dockerRunCommand.trim()) this.repo.dockerRunCommand = null;
    }

    save() {
        this._cleanData();
        return this._saveOrUpdate(this.repoResource.post(this.repo));
    }

    update() {
        this._cleanData();
        return this._saveOrUpdate(this.repoResource.put(this.isUpdating, this.repo));
    }

    addBlankEnvVar() {
        this.repo.envVars.push({key: '', value: ''});
    }

    removeEnvVar(envVar) {
        this.repo.envVars.splice(this.repo.envVars.indexOf(envVar), 1);
    }
}
