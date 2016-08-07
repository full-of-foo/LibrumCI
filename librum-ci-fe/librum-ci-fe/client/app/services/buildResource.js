export default class BuildResource {
    constructor($http, masterUrl) {
        "ngInject";

        this.$http = $http;
        this.baseUrl = `${masterUrl}/api/build/`;
    }

    get(id) {
        return this.$http.get(`${this.baseUrl}${id}`);
    }
}
