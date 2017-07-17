(function(){
angular.module("main_module",["customer_module","authentication_module","ngRoute","ngCookies"]);  //
angular.module("main_module").config(function($routeProvider,$locationProvider){   // no need of a name ;bcz this is the starting point
    $routeProvider
    .when('/',{
        templateUrl:'app/page/student.html'
    })
    .when('/login',{
           templateUrl:'app/page/login.html',
           controller: function(AuthenticationService,$location){   //without using $scope ;
               this.username="";
               this.password="";
           this.login =function(){
               user=this.username;
           AuthenticationService.login(this.username,this.password,function(response){
               if(response.success==true){
              AuthenticationService.setCredentials(user);
              $location.path("/");
               }
               else{
                alert(response.message);
               }

           });
           }
           },
           controllerAs :'vm'   //vm is an object of type controller 
    })
    }).run(check);
    function check($cookieStore,$location,$rootScope,$http){
        $rootScope.$on("$locationChangeStart",function(event,next,current){
  var user=$cookieStore.get('globals');
  var restrictedPage=$.inArray($location.path(),['/login','/register'])===-1;
  if(restrictedPage && !user){
     $location.path("/login");
  }
  else{
      $http.get(next);
  }
        });
    }


})();