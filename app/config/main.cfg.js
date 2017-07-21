(function () {
  angular.module("main_module", ["onlineExam_module", "assessmentController_module", "authentication_module", "ngRoute", "ngCookies", "angularjs-datetime-picker"]);
  angular.module("main_module").config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/page/login.html'
      })
      .when('/signup', {
        templateUrl: 'app/page/signup.html'
      })

      .when('/admin', {
        templateUrl: 'app/page/admin.html'
      })
      .when('/uploadQuestions', {
        templateUrl: 'app/page/uploadQuestion.html'
      })
      .when('/login', {
        templateUrl: 'app/page/login.html',
        controller: function (AuthenticationService, $location) {

          this.login = function () {
            user = this.username;
            AuthenticationService.login(this.username, this.password, function (response) {
              if (response.success == true) {
                AuthenticationService.setCredentials(user);
                $location.path("/");
              }
              else {
                alert(response.message);
              }

            });
          }
        },
        controllerAs: 'vm'
      })
      .when('/student', {
        templateUrl: 'app/page/student.html'
      })
      .when('/dashboard', {
        templateUrl: 'app/page/dashboard.html'
      })
      .when('/assessment', {
        templateUrl: 'app/page/assessment.html'
      })
      .when('/logout', {
        templateUrl: 'app/page/login.html',
        controller: 'LogoutController'

      })
  }).run(check);
  function check($cookieStore, $location, $rootScope, $http) {

    $rootScope.$on("$locationChangeStart", function (event, next, current) {
      if ($cookieStore.get('globals')) {
        $rootScope.globals = $cookieStore.get('globals');
        if (next == 'http://localhost:3000/') {
          if ($cookieStore.get('globals').type == 'admin') {
            $location.path('/admin');
          }
          else {
            $location.path('/student');
          }
        }
        else {
          $http.get(next);
        }
      }
      else {
        if (next == 'http://localhost:3000/#/signup') {
          $location.path('/signup');
        }
        else {
          $location.path('/login');
        }
      }
    });
  }


})();
