(function(){
    //$http is used to make http requests; $http is above ajax calls ; it makes coding easy because we dont need to bind variables here 
    //$q is a promise api ;for checking the $http response
angular.module("service_module").service("StudentService",function($http,$q){
    this.getStudent=function(id){
        var deferred= $q.defer();  //
        $http.get("http://localhost:3000/user/"+id).then(function(result){
            deferred.resolve(result);
            //$log.info(result);

        },
        function(result){
            deferred.reject(result);
        });
        return deferred.promise;
    };
    this.getExams=function(){
        var deferred=$q.defer();
        $http.get("http://localhost:3000/exam").then(function(result){
            deferred.resolve(result);
        },
        function(result){
            deferred.reject(result);
        });
        return deferred.promise;
    }
});
})();
