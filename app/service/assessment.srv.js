(function(){
    //$http is used to make http requests; $http is above ajax calls ; it makes coding easy because we dont need to bind variables here 
    //$q is a promise api ;for checking the $http response
    var app = angular.module('users_module', []);
    app.service("AssessmentService",function($http,$q){

    this.getExameById = function(exameId) {
        var deferred = $q.defer();
        $http.get("http://localhost:3000/exam/" + exameId).then(function(result) {
            deferred.resolve(result);
        },
        function(result) {
            deferred.reject(result);
        });
        return deferred.promise;
    };

    this.getQuestionById = function(quesId) {
        var deferred = $q.defer();
        $http.get("http://localhost:3000/question/" + quesId).then(function(result) {
            deferred.resolve(result);
        },
        function(result) {
            deferred.reject(result);
        });
        return deferred.promise;
    };
});
})();
