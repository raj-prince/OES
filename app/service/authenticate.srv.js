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
		this.registerUser = function(email,pwd,firstName,lastName) {
			var dataObj = {
      "email": email,
      "password": pwd,
      "type": "student",
      "firstName":firstName,
      "lastName":lastName,
      "exam":[]
		};	
		var res = $http.post('http://localhost:3000/user/', dataObj);
		res.success(function(data, status, headers, config) {
			
			console.log("successfully registered");
		});
		res.error(function(data, status, headers, config) {
			alert( "failure message: " + JSON.stringify({data: data}));
		});	
		}

		this.setCredentials = function(userId,firstName,emailId,exam,type) {
			var obj = {userId : userId,
							firstName : firstName,
							email : emailId,
							type : type,
							exam : exam
					};		
			$rootScope.globals = obj;

			$cookieStore.put('globals', obj); //not angular specific ;instead of cookie jwt (json web token ) can be used ;jwt-one time generation ;keeps timestamps too;jwt is more secure than cookie for session handling 
		}

		this.clearCredentials = function() {
			$rootScope.globals = {};
			$cookieStore.remove('globals');
		}
	});
})();
