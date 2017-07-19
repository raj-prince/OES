(function(){
    //$http is used to make http requests; $http is above ajax calls ; it makes coding easy because we dont need to bind variables here 
    //$q is a promise api ;for checking the $http response
angular.module("service_module").service("QuestionService",function($http,$q){
    this.getQuestion=function(id){
        var deferred= $q.defer();  //
        $http.get("http://localhost:3000/question/"+id).then(function(result){
            deferred.resolve(result);
        },
        function(result){
            deferred.reject(result);
        });
        return deferred.promise;
    };
   
});
})();
