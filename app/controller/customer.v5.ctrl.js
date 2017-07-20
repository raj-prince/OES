
(function () {
  var app = angular.module("customer_module", ["admin_module","directive_module", "service_module", "authentication_module", 'users_module','angularUtils.directives.dirPagination','ui.bootstrap']);

  app.controller("StudentExamListController", function ($scope, $rootScope, StudentService,ResponseService,QuestionService,$uibModal) {

    $scope.dashBoard = true;
    $scope.showDashboard = function () {
      console.log($rootScope.globals.userId);
      $scope.dashBoard = true;

    }
    $scope.examsId = examsId = [];
    $scope.user = user = [];
    
    StudentService.getStudent($rootScope.globals.userId).then(function (result) {
      $scope.examsId = examsId = result.data.exam;
      $scope.user = result.data;

    });
    $scope.examsId = examsId;
    $scope.user = user;
    $scope.takenExams=takenExams=[];
    $scope.exams = exams = [];
    StudentService.getExams().then(function (result) {
      $scope.exams = exams = result.data;
      for (var i = 0; i < exams.length; i++) {
        $scope.exams[i].status = "Not registered";
        for (var j = 0; j < examsId.length; j++) {
          //console.log(exams[i].id, examsId[j])
          if (exams[i].id == examsId[j]) {
            $scope.exams[i].status = "Registered";
            if($scope.user.taken[j]==1){
            $scope.exams[i].taken=true;
            $scope.takenExams.push(exams[i]);
          }
          else{
            $scope.exams[i].taken=false;
          }
          }
        }
       
      }
    });
    $scope.exams=exams;
    $scope.now =now= Math.round(new Date().getTime()/1000);
   //$scope.now.toDateString();
    //  var currentDate=now.getDate();
    //  var currentMonth=now.getMonth();
    //  var currentYear=now.getFullYear();

    $scope.showExamLink = function (end,start) {

    //  console.log(parseInt(end)+" "+ parseInt(Math.round(new Date().getTime()/1000))+ " "+ parseInt(start));
      return (parseInt(end)>parseInt(now) && parseInt(start)<parseInt(now));
    //   var endDateValue = new Date(end*1000);
    //   var startDateValue=new Date(start*1000);

    //   var endDate=endDateValue.getDate();
    //   var endMonth=endDateValue.getMonth();
    //   var endYear=endDateValue.getFullYear();

    //   var startDate=startDateValue.getDate();
    //   var startMonth=startDateValue.getMonth();
    //   var startYear=startDateValue.getFullYear();
      
    //   var v1=false;

    //   {
    //   if(currentYear<endYear)v1=true;
    //   else if(currentYear==endYear){
    //     if( currentMonth<endMonth){
    //       return v1=true;
    //     }
    //     else if(currentMonth==endMonth)
    //     {
    //       if(currentDate<=endDate){
    //         v1=true;
    //       }
    //     }
    //   }
    //   else
    //   v1=false;
    // }
    // var v2=false;
    //  {
    //   if(currentYear<startYear)v2=true;
    //   else if(currentYear==startYear){
    //     if( currentMonth<startMonth){
    //       return v2=true;
    //     }
    //     else if(currentMonth==startMonth)
    //     {
    //       if(currentDate<startDate){
    //         v2=true;
    //       }
    //       else v2=false;
    //     }
    //   }
    //   else
    //   v2=false;
    // }
    
    // return v1 && !v2;
  
    }

    $scope.checkDate=function(date,month,year){
      if(currentYear<year)return true;
      else if(currentYear==year){
        if( currentMonth1<month){
          return true;
        }
        else if(currentMonth==month)
        {
          if(currentDay<=day){
            return true;
          }
        }
      }
      return false;
    }

    
    


    $scope.responses = responses = [];

    ResponseService.getResponse().then(function (result) {
      $scope.responses = responses = result.data;
    });

$scope.responses = responses;
$scope.isCorrect=isCorrect=[];
$scope.totalMarks=totalMarks=0;
$scope.obtainedMarks=obtainedMarks=0;
questions=[]
userResponse=[]
var j=0
$scope.calculateResult=function(exam){
    for(var i=0;i<responses.length;i++){
      console.log('here'+ i)
      if(responses[i].userId==$rootScope.globals.userId && isInListOfQuestions(exam.listOfQuestions,responses[i].questionId)){
        userResponse.push(responses[i]);
        res=QuestionService.getQuestion(responses[i].questionId,i)
        res.then(function (result) {
      // $scope.question = question= result.data;
       questions.push(result.data)
        // totalMarks+=parseInt($scope.question.marks);
        // console.log(responses[i].responseText)
        // console.log(question.correctAnswer)
        // console.log(i)
      // if(responses[i].responseText==question.correctAnswer)
      // obtainedMarks+=parseInt(question.marks);
  } 
  
   
    );
//      res.then(function (result){
// alert("totalMarks=" +totalMarks + " "+obtainedMarks);
// totalMarks=0;
// obtainedMarks=0;
    //  });
   
      }
    }
    res.then(function (result){
      for(var i=0;i<userResponse.length;i++){
        totalMarks+=parseInt(questions[i].marks);
        isCorrect[i]=false;
        if(userResponse[i].responseText==questions[i].correctAnswer){
           obtainedMarks+=parseInt(questions[i].marks);
           isCorrect[i]=true;
        }
      }
//alert("totalMarks=" +totalMarks + " "+obtainedMarks);
$scope.totalMarks=totalMarks;
$scope.obtainedMarks=obtainedMarks;
$scope.userResponse=userResponse;
$scope.questions=questions;
var modalInstance = $uibModal.open({
templateUrl: 'app/page/viewResult.html',
controller: 'PopupCont',
scope: $scope,
   controllerAs: 'vm',
   bindToController: true,
   resolve: {
        users: function() {
          return $scope.questions;
        },
        response: function(){
          return $scope.response;
        }

      }
});
 


totalMarks=0;
obtainedMarks=0;
userResponse=[];
questions=[];
})
}
   
    isInListOfQuestions = function (listOfQuestions, questionId) {
      for (var i = 0; i < listOfQuestions.length; i++) {
        if (listOfQuestions[i] == questionId) {
          return true;
        }
      }
      return false;
    }

    $scope.sort=function(keyName){
      $scope.sortKey=keyName;
      $scope.reverse=!$scope.reverse;
    }


    $scope.result=false;
    $scope.showResult=function(){
      $scope.result=!$scope.result;
    }

    

$scope.setExamId= function(id){
  $rootScope.id=id;
   $location.path("/assessment");
}
  });

  app.controller('PopupCont', ['$scope','$modalInstance',function ($scope, $modalInstance) {
            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);



  app.controller("LoginController", function ($scope, $location, AuthenticationService) {
    $scope.login = function () {
      AuthenticationService.getUsers().then(function (result) {
        var users = result.data;
        var i = 0;
        for (i = 0; i < users.length; i++) {
          if (users[i].email == $scope.username && users[i].password == $scope.password) {
            break;
          }
        }
        if (i == users.length) {
          alert("INCORRECT EMAIL OR PASSWORD!!");

        }
        else {
          // alert("logging in ")
          if (users[i].type == "admin") {
            // console.log("admin");
            $location.path('/admin')
          }
          else {
            $location.path("/student");
          }
          // AuthenticationService.setCredentials(users[i].id, users[i].firstName, users[i].email);
          AuthenticationService.setCredentials(users[i].id,users[i].firstName,users[i].email,users[i].exam,users[i].type);
      
        }

        

      });
    }

    $scope.signUp = function () {
      $location.path("/signup");
    }

  });

  app.controller("SignUpController", function ($scope, $location, AuthenticationService) {
    $scope.register = function () {
      AuthenticationService.registerUser($scope.email, $scope.password, $scope.firstName, $scope.lastName);
      $location.path('/');

    }



  });


app.controller('AdminController', function($scope, $rootScope, UsersService, AdminService,$http){
  $scope.upload = true;
  $scope.result = false;
  $scope.schedule = false;
  $scope.showScheduleButton = false;
  $scope.showScheduleFinal = false;
  $scope.showUploadButton = true;
  $scope.showUploadFinal = false;
  $scope.adminExams = [];
  all_users = [];
  UsersService.getUsers().then(function(result) {
    all_users = result.data;
  });
  $scope.uploadQuestion = function() {
    $scope.upload = true;
      $scope.result = false;
      $scope.schedule = false;
      $scope.showUploadButton = true;
      $scope.showUploadFinal = false;
      $scope.showScheduleButton = false;
    $scope.showScheduleFinal = false;
    }


  $scope.scheduleExam = function() {
    $scope.upload = false;
    $scope.result = false;
    $scope.schedule = true;
    $scope.showScheduleButton = true;
    $scope.showScheduleFinal = false;
    $scope.showUploadButton = false;
      $scope.showUploadFinal = false;
    var temp = [];
    AdminService.getExams().then(function(result) {
      var exams = result.data;
      console.log("the length is");
      
      for(var i =0;i<$rootScope.globals.exam.length;i++)
      {
        for(var j = 0;j<exams.length;j++) {
          if($rootScope.globals.exam[i] == exams[j].id) {
            temp.push(exams[j]);
            break;
          }
        }
      }

      $scope.adminExams = temp;
      // console.log($scope.adminExams);
    });
  }

  // UsersService.getUserById($rootScope.globals.userId).then(function(result) {
  // $scope.firstName= result.data.firstName
  // console.log($scope.firstName)
  // });

  $scope.Schedule = function() {
    
    var start_timestamp = Date.parse($scope.examDate)/1000;
    var end_timestamp = start_timestamp + parseInt($scope.duration)*60;
    var i;
    AdminService.updateExam($scope.exam_name,start_timestamp,end_timestamp,$scope.duration);

    AdminService.readExaminees(function(response) {
      
      for(i=0;i<response.length;i++){
        AdminService.updateUser(all_users,response[i],$scope.exam_name.id);

      }
      
    });
    $scope.showScheduleButton = false;
  $scope.showScheduleFinal = true;
  }
  $scope.add = function() {
    console.log('here')
    var f = document.getElementById('file').files[0],
        r = new FileReader();
      var listOfQuestions = []
      user_id=$rootScope.globals.userId
      r.onloadend = function (e) {
        var data = e.target.result;
        // console.log(data)
        // console.log($scope.examName)

        var lines = data.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
        for (var i = 1; i < lines.length - 1; i++) {
          var line = lines[i].split(',')
          // var endIndex=line.length
          var options = []
          for (var j = 4; j < line.length; j++) {
            if (line[j].length > 0) options.push(line[j])
          }
          // qid=
          // console.log('hiodasoi')
          res = AdminService.addQuestion(line[0], line[1], line[2], line[3], options)
          res.success(function (data, status, headers, config) {
            listOfQuestions.push(data.id)
          })

        }
        res.success(function (data, status, headers, config) {
          res2=AdminService.addExam($scope.examName, listOfQuestions)
          res2.success(function (data, status, headers, config) {
            UsersService.getUserById(user_id).then(function(result){
              AdminService.updateAdminExam(result.data, data.id );
              $rootScope.globals.exam.push(data.id);

            })
            
          })
        })

        $scope.showUploadButton = false;
      $scope.showUploadFinal = true;
        //send your binary data via $http or $resource or do anything else with it
      }

      r.readAsText(f);

      console.log('read');

    }

    // $scope.addExam = function (examName, listOfQuestions) {
    //   var dataObj = {
    //     "examName": examName,
    //     "startDate": 0,
    //     "endDate": 0,
    //     "duration": 0,
    //     "listOfQuestions": listOfQuestions
    //   };
    //   var res = $http.post('http://localhost:3000/exam/', dataObj);
    //   res.success(function (data, status, headers, config) {
    //     console.log(data)
    //     console.log("successfully registered");
    //   });
    //   res.error(function (data, status, headers, config) {
    //     alert("failure message: " + JSON.stringify({ data: data }));
    //   });
    // }

    // $scope.addQuestion = function (qtext, type, marks, correctAnswer, listOfChoices) {
    //   var dataObj = {
    //     "questionText": qtext,
    //     "marks": marks,
    //     "correctAnswer": correctAnswer,
    //     "listOfChoices": listOfChoices,
    //     "type": type
    //   }
    //   var res = $http.post('http://localhost:3000/question/', dataObj);
    //   return res
    //   res.success(function (data, status, headers, config) {
    //     console.log(data.id + 'hoduahofa')
    //     console.log("successfully registered");
    //     return data.id
    //   });
    //   res.error(function (data, status, headers, config) {
    //     alert("failure message: " + JSON.stringify({ data: data }));
    //   });
    // }


  })



})();
