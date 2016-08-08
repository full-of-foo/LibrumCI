export default class RepoResource {
    constructor($http, masterUrl) {
        'ngInject';

        this.$http = $http;
        this.baseUrl = `${masterUrl}/api/repo/`;
    }

    get(id) {
        return this.$http.get(`${this.baseUrl}${id}`, {params:{isFull: '1'}});
    }

    getAll() {
        return this.$http.get(this.baseUrl);
    }

    post(data) {
        return this.$http.post(this.baseUrl, data);
    }

    put(id, data) {
        return this.$http.put(`${this.baseUrl}${id}`, data);
    }
}
