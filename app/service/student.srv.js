(function () {
    angular.module("service_module").service("StudentService", function ($http, $q) {
        this.getStudent = function (id) {
            var deferred = $q.defer();
            $http.get("http://localhost:3000/user/" + id).then(function (result) {
                deferred.resolve(result);


            },
                function (result) {
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        this.getExams = function () {
            var deferred = $q.defer();
            $http.get("http://localhost:3000/exam").then(function (result) {
                deferred.resolve(result);
            },
                function (result) {
                    deferred.reject(result);
                });
            return deferred.promise;
        }
    });
})();
