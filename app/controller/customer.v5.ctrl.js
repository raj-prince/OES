(function(){
	var app=angular.module("customer_module",["directive_module","service_module","authentication_module"]);               

app.controller("StudentExamListController",function($scope,$rootScope,StudentService){ 

    $scope.dashBoard = false;
    $scope.showDashboard = function() {
      console.log($rootScope.globals.userId);
      $scope.dashBoard = true;

    }
   // $scope.examsId=examsId=[];
   // $scope.user=user=[];
   //      StudentService.getStudent().then(function(result){
   //         $scope.examsId=examsId=result.data.exam;
   //         console.log(examsId)
   //         $scope.user=result.data;
           
   //      });
   //  $scope.examsId=examsId;
   //  $scope.user=user;

   // $scope.examsToShow=examsToShow=[];
    $scope.exams=exams=[];
    StudentService.getExams().then(function(result){
            $scope.exams=exams=result.data;
            // console.log(exams)
        // for(var i=0;i<exams.length;i++){
          // for(var j=0;j<examsId.length;j++){
            // console.log(exams[i].id, examsId[j])
            // if(exams[i].id==examsId[j]){
              // examsToShow.push(exams[i]);
              // examsId[j]=-1;
            // }
          // }
        // }
   

        });
        // console.log('hehid')
        $scope.exams=exams;
        // console.log(exams, examsToShow)
        // $scope.examsToShow=examsToShow;

});

app.controller("LoginController",function($scope,$location,AuthenticationService){
  $scope.login = function() {
    AuthenticationService.getUsers().then(function(result) {
      var users = result.data;
      var i =0;
      for(i = 0;i<users.length;i++) {
        if(users[i].email == $scope.username && users[i].password == $scope.password) {
          break;
        }
      }
      if(i== users.length) {
        alert("INCORRECT EMAIL OR PASSWORD!!");
        
      }
      else {
        alert("logging in ")
        if(users[i].type == "admin") {
          console.log("admin");
        }
        else {
          $location.path("/student");
        }
        AuthenticationService.setCredentials(users[i].id,users[i].firstName,users[i].email);
      }

    });
  }

  $scope.signUp = function() {
    $location.path("/signup");
  }

});

app.controller("SignUpController",function($scope,$location,AuthenticationService){
  $scope.register = function() {
    AuthenticationService.registerUser($scope.email,$scope.password,$scope.firstName,$scope.lastName);
    $location.path('/');
    
  }

  

});

app.controller('AdminController', function($scope, $rootScope){
  $scope.allUsers= UsersService.getUsers()
  $scope.firstName= $scope.allUsers[$rootScope.globals[username]][firstName]
  // $scope.lastName= UsersService.getLastName()
  console.log($scope.firstName)
})


})();
