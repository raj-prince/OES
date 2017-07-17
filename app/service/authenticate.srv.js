(function() {
	var app = angular.module('authentication_module', [ 'ngCookies' ]);
	app.service('AuthenticationService', function($http, $q,$cookieStore,
			$rootScope) {
		this.login = function(username, password, callback) {
			if (username !== 'test' && password !== 'password') {
				response = {
					success : true
				};
			} else {
				response = {
					success : false,
					message : 'Username or password is incorrect'
				};
			}
			callback(response);
		}
		this.getUsers = function() {
			var deferred= $q.defer();
			$http.get("http://localhost:3000/user").then(function(result){
				deferred.resolve(result);
			},
			function(result){
            deferred.reject(result);
        });
        return deferred.promise;

		}
		this.setCredentials = function(userId,firstName,emailId) {
			$rootScope.globals = {
							userId : userId,
							firstName : firstName,
							email : emailId
			};

			$cookieStore.put('globals', userId); //not angular specific ;instead of cookie jwt (json web token ) can be used ;jwt-one time generation ;keeps timestamps too;jwt is more secure than cookie for session handling 
		}

		this.clearCredentials = function() {
			$rootScope.globals = {};
			$cookieStore.remove('globals');
		}
	});
})();