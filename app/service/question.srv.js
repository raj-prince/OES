(function () {
    angular.module("service_module").service("QuestionService", function ($http, $q) {
        this.getQuestion = function (id) {
            var deferred = $q.defer();
            $http.get("http://localhost:3000/question/" + id).then(function (result) {
                deferred.resolve(result);
            },
                function (result) {
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        this.getQuestions = function () {
            var deferred = $q.defer();
            $http.get("http://localhost:3000/question/").then(function (result) {
                deferred.resolve(result);
            },
                function (result) {
                    deferred.reject(result);
                });
            return deferred.promise;
        };

    });
})();
