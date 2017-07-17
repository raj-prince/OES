(function() {
	var app = angular.module('authentication_module', [ 'ngCookies' ]);
	app.service('AuthenticationService', function($http, $cookieStore,
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

		this.setCredentials = function(username) {
			$rootScope.globals = {
							username : username
			};

			$cookieStore.put('globals', username); //not angular specific ;instead of cookie jwt (json web token ) can be used ;jwt-one time generation ;keeps timestamps too;jwt is more secure than cookie for session handling 
		}

		this.clearCredentials = function() {
			$rootScope.globals = {};
			$cookieStore.remove('globals');
		}
	});
})();