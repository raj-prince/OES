(function () {
  var app = angular.module("onlineExam_module", ["admin_module", "directive_module", "service_module", "authentication_module", 'users_module', 'angularUtils.directives.dirPagination', 'ui.bootstrap']);

  app.controller("StudentExamListController", function ($scope, $rootScope, StudentService, ResponseService, QuestionService, $uibModal, $location) {

    $scope.dashBoard = true;
    $scope.showDashboard = function () {

    $scope.dashBoard = true;

    }
    $scope.logout = function () {
      $location.path("/logout");
    }
    $scope.examsId = examsId = [];
    $scope.user = user = [];

    var init = function () {

      StudentService.getStudent($rootScope.globals.userId).then(function (result) {
        $scope.examsId = examsId = result.data.exam;
        $scope.user = result.data;



        $scope.takenExams = takenExams = [];
        $scope.exams = exams = [];

      StudentService.getExams().then(function (result) {
        $scope.exams = exams = result.data;
          for (var i = 0; i < exams.length; i++) {
            $scope.exams[i].status = "Not registered";
          for (var j = 0; j < examsId.length; j++) {
            if (exams[i].id == examsId[j]) {
              $scope.exams[i].status = "Registered";
               if ($scope.user.taken[j] == 1) {
                $scope.exams[i].taken = true;
                $scope.takenExams.push(exams[i]);
                }
               else {
                $scope.exams[i].taken = false;
                }
              }
            }
          }
        });
      });
    }
    init();

    $scope.now = now = Math.round(new Date().getTime() / 1000);
    $scope.showExamLink = function (end, start) {
      return (parseInt(end) > parseInt(now) && parseInt(start) < parseInt(now));
    }

   $scope.isLate=function(endDate){
      return (parseInt(end))<parseInt(now);
    }

    $scope.responses = responses = [];
    var allQuestions = [];
    ResponseService.getResponse().then(function (result) {
      $scope.responses = responses = result.data;
    });

    QuestionService.getQuestions().then(function (result) {
      allQuestions = result.data;
    });
    $scope.responses = responses;

    $scope.isCorrect = isCorrect = [];
    $scope.totalMarks = totalMarks = 0;
    $scope.obtainedMarks = obtainedMarks = 0;
    questions = []
    userResponse = []
    var j = 0
    $scope.calculateResult = function (exam) {
      for (var i = 0; i < responses.length; i++) {
        if (responses[i].userId == $rootScope.globals.userId && isInListOfQuestions(exam.listOfQuestions, responses[i].questionId)) {
          userResponse.push(responses[i]);
          res = QuestionService.getQuestion(responses[i].questionId, i)
          questions.push(allQuestions[responses[i].questionId]);


        }
      }

      for (var i = 0; i < userResponse.length; i++) {
        totalMarks += parseInt(questions[i].marks);
        isCorrect[i] = false;
        if (userResponse[i].responseText == questions[i].correctAnswer) {
          obtainedMarks += parseInt(questions[i].marks);
          isCorrect[i] = true;
        }
      }

      $scope.totalMarks = totalMarks;
      $scope.obtainedMarks = obtainedMarks;
      $scope.userResponse = userResponse;
      $scope.questions = questions;
      var modalInstance = $uibModal.open({
        templateUrl: 'app/page/viewResult.html',
        controller: 'PopupCont',
        scope: $scope,
        controllerAs: 'vm',
        bindToController: true,
        resolve: {
          users: function () {
            return $scope.questions;
          },
          response: function () {
            return $scope.response;
          }

        }
      });



      totalMarks = 0;
      obtainedMarks = 0;
      userResponse = [];
      questions = [];

    }

    isInListOfQuestions = function (listOfQuestions, questionId) {
      for (var i = 0; i < listOfQuestions.length; i++) {
        if (listOfQuestions[i] == questionId) {
          return true;
        }
      }
      return false;
    }
    $scope.sortKey='examName';
    $scope.reverse=false;
    $scope.sort = function (keyName) {
      $scope.sortKey = keyName;
      $scope.reverse = !$scope.reverse;
    }


    $scope.result = false;
    $scope.showResult = function () {
      $scope.result = !$scope.result;
    }



    $scope.setExamId = function (id) {
      $rootScope.id = id;
      $location.path("/assessment");
    }

  
  });


  app.controller('PopupCont', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
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

          if (users[i].type == "admin") {

            $location.path('/admin')
          }
          else {
            $location.path("/student");
          }


          AuthenticationService.setCredentials(users[i].id, users[i].firstName, users[i].email, users[i].exam, users[i].type);

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



  app.controller('AdminController', function ($location, $scope, $rootScope, UsersService, AdminService, $http, ResponseService, QuestionService, $uibModal) {
    $scope.upload = true;
    $scope.result = false;
    $scope.schedule = false;
    $scope.showScheduleButton = false;
    $scope.showScheduleFinal = false;
    $scope.showUploadButton = true;
    $scope.showUploadFinal = false;
    $scope.studentResult = false;
    $scope.adminExams = [];
    all_users = [];
    UsersService.getUsers().then(function (result) {
      all_users = result.data;
    });
    $scope.selectedExam;
    $scope.usersGivingExam;
    var flag = 1
    $scope.$watch('selectedExam', function (newValue, oldValue) {
      $scope.usersGivingExam = []
      for (user in all_users) {
        user = all_users[user]
        idx = user.exam.indexOf($scope.selectedExam.id)
        if ((user.type == 'student') && (idx >= 0) && (user.taken[idx] == 1)) {
          flag = 0
          $scope.calculateResult(user)
          user['obtainedMarks'] = $scope.obtainedMarks
          flag = 1
          $scope.usersGivingExam.push(user)
        }
      }
      if (newValue != oldValue) {
        $scope.studentResult = true
      }


    })
    $scope.sort = function (keyName) {
      $scope.sortKey = keyName;
      $scope.reverse = !$scope.reverse;
    }
    $scope.startDate;
    $scope.toDate

    $scope.$watchGroup(["startDate", "toDate"], function (newValue, oldValue) {

      var temp = [];
      AdminService.getExams().then(function (result) {
        var exams = result.data;

        for (var i = 0; i < $rootScope.globals.exam.length; i++) {
          for (var j = 0; j < exams.length; j++) {
            if ($rootScope.globals.exam[i] == exams[j].id) {
              temp.push(exams[j]);
              break;
            }
          }
        }

        $scope.adminExams = temp;

        fromDate = Date.parse($scope.startDate) / 1000
        toDate = Date.parse($scope.toDate) / 1000

        removalExamsIdx = []
        for (var i = 0; i < $scope.adminExams.length; i++) {

          if (($scope.adminExams[i].startDate < fromDate) || ($scope.adminExams[i].startDate > toDate)) {
            removalExamsIdx.push(i)
          }
        }

        for (var i = removalExamsIdx.length - 1; i >= 0; i--) {
          $scope.adminExams.splice(removalExamsIdx[i], 1)
        }

      });

    });


    $scope.uploadQuestion = function () {
      $scope.upload = true;
      $scope.result = false;
      $scope.schedule = false;
      $scope.showUploadButton = true;
      $scope.showUploadFinal = false;
      $scope.showScheduleButton = false;
      $scope.showScheduleFinal = false;
      $scope.studentResult = false;
    }

    $scope.viewResult = function () {
      $scope.upload = false;
      $scope.result = true;
      $scope.schedule = false;
      $scope.studentResult = false;
      var temp = [];
      AdminService.getExams().then(function (result) {
        var exams = result.data;


        for (var i = 0; i < $rootScope.globals.exam.length; i++) {
          for (var j = 0; j < exams.length; j++) {
            if ($rootScope.globals.exam[i] == exams[j].id) {
              temp.push(exams[j]);
              break;
            }
          }
        }

        $scope.adminExams = temp;

      });
    }

    $scope.filterExamList = function () {

      var temp = [];
      AdminService.getExams().then(function (result) {
        var exams = result.data;


        for (var i = 0; i < $rootScope.globals.exam.length; i++) {
          for (var j = 0; j < exams.length; j++) {
            if ($rootScope.globals.exam[i] == exams[j].id) {
              temp.push(exams[j]);
              break;
            }
          }
        }

        $scope.adminExams = temp;


        fromDate = Date.parse($scope.fromDate) / 1000
        toDate = Date.parse($scope.toDate) / 1000
        for (var i = 0; i < $scope.adminExams.length; i++) {

          if (($scope.adminExams[i].startDate < fromDate) || ($scope.adminExams[i].startDate > toDate)) {


            $scope.adminExams.splice(i, 1);
          }
        }


      });

    }
    $scope.scheduleExam = function () {
      $scope.upload = false;
      $scope.result = false;
      $scope.schedule = true;
      $scope.showScheduleButton = true;
      $scope.showScheduleFinal = false;
      $scope.showUploadButton = false;
      $scope.showUploadFinal = false;
      $scope.studentResult = false;
      var temp = [];
      AdminService.getExams().then(function (result) {
        var exams = result.data;


        for (var i = 0; i < $rootScope.globals.exam.length; i++) {
          for (var j = 0; j < exams.length; j++) {
            if ($rootScope.globals.exam[i] == exams[j].id) {
              temp.push(exams[j]);
              break;
            }
          }
        }
        $scope.adminExams = temp;

      });
    }


    $scope.Schedule = function () {

      var start_timestamp = Date.parse($scope.examDate) / 1000;
      var end_timestamp = start_timestamp + parseInt($scope.duration) * 60;
      var i;
      AdminService.updateExam($scope.exam_name, start_timestamp, end_timestamp, $scope.duration);

      AdminService.readExaminees(function (response) {

        for (i = 0; i < response.length; i++) {
          AdminService.updateUser(all_users, response[i], $scope.exam_name.id);

        }

      });
      $scope.showScheduleButton = false;
      $scope.showScheduleFinal = true;
    }
    $scope.add = function () {

      var f = document.getElementById('file').files[0],
        r = new FileReader();
      var listOfQuestions = []
      user_id = $rootScope.globals.userId
      r.onloadend = function (e) {
        var data = e.target.result;


        var lines = data.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
        var temp = [];
        for (var i = 0; i < lines.length; i++) {
          if (lines[i].trim().length > 0) {
            temp.push(lines[i]);
          }
        }
        lines = temp;
        for (var i = 1; i < lines.length; i++) {
          var line = lines[i].split(',')

          var options = []
          for (var j = 4; j < line.length; j++) {
            if (line[j].length > 0) options.push(line[j])
          }

          res = AdminService.addQuestion(line[0], line[1], line[2], line[3], options)
          res.success(function (data, status, headers, config) {
            listOfQuestions.push(data.id)
          })

        }
        res.success(function (data, status, headers, config) {
          res2 = AdminService.addExam($scope.examName, listOfQuestions)
          res2.success(function (data, status, headers, config) {
            UsersService.getUserById(user_id).then(function (result) {
              AdminService.updateAdminExam(result.data, data.id);
              $rootScope.globals.exam.push(data.id);

            })

          })
        })

        $scope.showUploadButton = false;
        $scope.showUploadFinal = true;

      }

      r.readAsText(f);



    }




    $scope.responses = responses = [];

    ResponseService.getResponse().then(function (result) {
      $scope.responses = responses = result.data;
    });

    $scope.responses = responses;
    $scope.isCorrect = isCorrect = [];
    $scope.totalMarks = totalMarks = 0;
    $scope.obtainedMarks = obtainedMarks = 0;
    questions = []
    userResponse = []
    var j = 0
    var allQuestions;
    QuestionService.getQuestions().then(function (result) {
      allQuestions = result.data
    })

    $scope.calculateResult = function (student) {
      exam = $scope.selectedExam
      for (var i = 0; i < responses.length; i++) {

        if (responses[i].userId == student.id && isInListOfQuestions(exam.listOfQuestions, responses[i].questionId)) {
          userResponse.push(responses[i]);

          for (ques in allQuestions) {

            if (allQuestions[ques].id == responses[i].questionId) {
              questions.push(allQuestions[ques])
            }
          }

        }
      }

      for (var i = 0; i < userResponse.length; i++) {
        totalMarks += parseInt(questions[i].marks);
        isCorrect[i] = false;
        if (userResponse[i].responseText == questions[i].correctAnswer) {
          obtainedMarks += parseInt(questions[i].marks);
          isCorrect[i] = true;
        }
      }

      $scope.totalMarks = totalMarks;
      $scope.obtainedMarks = obtainedMarks;
      $scope.userResponse = userResponse;
      $scope.questions = questions;
      if (flag == 1) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/page/viewResult.html',
          controller: 'PopupCont',
          scope: $scope,
          controllerAs: 'vm',
          bindToController: true,
          resolve: {
            users: function () {
              return $scope.questions;
            },
            response: function () {
              return $scope.response;
            }

          }
        });
      }


      totalMarks = 0;
      obtainedMarks = 0;
      userResponse = [];
      questions = [];

    }

    isInListOfQuestions = function (listOfQuestions, questionId) {
      for (var i = 0; i < listOfQuestions.length; i++) {
        if (listOfQuestions[i] == questionId) {
          return true;
        }
      }
      return false;
    }


    $scope.logout = function () {
      $location.path("/logout");
    }
  })

  app.controller('LogoutController', function ($location, AuthenticationService) {

    AuthenticationService.clearCredentials();
    $location.path('/login');
  })



})();