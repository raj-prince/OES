(function(){
	var app = angular.module('users_module', []);
	app.service("UsersService",function($http,$q){
	this.getUsers=function(){
        var deferred= $q.defer();  //
        $http.get("http://localhost:3000/user").then(function(result){
            deferred.resolve(result);
            //$log.info(result);

        },
        function(result){
            deferred.reject(result);
        });
        return deferred.promise;
    };
    this.getUserById=function(id){
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

    // this.getFirstName=function(){

    // }

});

})();	