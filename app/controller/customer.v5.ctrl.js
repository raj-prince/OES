(function(){
	var app=angular.module("customer_module",["directive_module","service_module","authentication_module", 'users_module']);               

app.controller("StudentExamListController",function($scope,$rootScope,StudentService){ 

    $scope.dashBoard = true;
    $scope.showDashboard = function() {
      console.log($rootScope.globals.userId);
      $scope.dashBoard = true;

    }
   $scope.examsId=examsId=[];
   $scope.user=user=[];
        StudentService.getStudent($rootScope.globals.userId).then(function(result){
           $scope.examsId=examsId=result.data.exam;
           $scope.user=result.data;
           
        });
    $scope.examsId=examsId;
    $scope.user=user;

    $scope.exams=exams=[];
    StudentService.getExams().then(function(result){
        $scope.exams=exams=result.data;
        for(var i=0;i<exams.length;i++){
          $scope.exams[i].status="Not registered";
          for(var j=0;j<examsId.length;j++){
            console.log(exams[i].id, examsId[j])
            if(exams[i].id==examsId[j]){
              $scope.exams[i].status="Registered";
            }
          }
        }
         });
      $scope.now = new Date();
      $scope.now.toISOString();
      $scope.showExamLink = function(date) {
       var d=new Date(date*1000);
       d.toISOString();
      return (d > $scope.now );
     }
       
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
        // alert("logging in ")
        if(users[i].type == "admin") {
          // console.log("admin");
          $location.path('/admin')
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

app.controller('AdminController', function($scope, $rootScope, UsersService){
  UsersService.getUserById($rootScope.globals.userId).then(function(result) {
  $scope.firstName= result.data.firstName
  console.log($scope.firstName)
});

  $scope.addQP = function() {
    console.log('here')
    var f = document.getElementById('file').files[0],
        r = new FileReader();

    r.onloadend = function(e) {
      var data = e.target.result;
      //send your binary data via $http or $resource or do anything else with it
    }

    r.readAsBinaryString(f);
    console.log('read')
}
  
})


})();
