(function () {
    angular.module("service_module").service("ResponseService", function ($http, $q) {
        this.getResponse = function () {
            var deferred = $q.defer();
            $http.get("http://localhost:3000/responses").then(function (result) {
                deferred.resolve(result);


            },
                function (result) {
                    deferred.reject(result);
                });
            return deferred.promise;
        };
    });
})();
