(function() {
    angular.module('app')
        .constant('githooksUrl', '{{GITHOOKS_URL}}')
        .constant('masterUrl', '{{MASTER_URL}}');
})();
