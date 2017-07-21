(function () {
  var app = angular.module("assessmentController_module", ["assessment_module"]);
  // Assessment Controller Begin.
  app.controller("AssessmentController", function ($scope, $location, AssessmentService, $rootScope) {

    $scope.showStartButton = true;
    $scope.displayQuestion = false;
    $scope.showRadioButton = false;
    $scope.showCheckboxOption = false;
    $scope.showRadioOption = false;
    $scope.showFillText = false;
    $scope.showTimer = false;
    $scope.showNextButton = true;
    $scope.showPrevButton = false;
    $scope.exameHeader = false;
    $scope.totalQuestions = 0;
    $scope.totalAnswered = 0;
    $scope.totalUnanswered = 0;
    $scope.options = [];
    $scope.hours = 0;
    $scope.minutes = 0;
    $scope.seconds = 0;
    $scope.nameOfExame = "";

    var questionIds = [];
    var totalQuestionIds = [];
    ques_id_idx = 0;
    questionList = [];

    var userId = $rootScope.globals.userId;
    var durations = 10;

    var userObj;

    var exameId = $rootScope.id;


    var prevResponse = "";
    var currentResponse = "";
    // store (userId * 1000 + quesId) as key
    // response Object as value
    var hash = new Object();

    $scope.question = question = {};
    $scope.questionId = ques_id_idx + 1;

    $scope.confirmAssessmentFinish = function () {
      if (confirm("Do you really want to Finish Assessment?") == true) {
        finishAssessment();
      }
    }

    var finishAssessment = function () {
      if ($scope.showNextButton == true) {
        $scope.loadNextQues();
      } else if ($scope.showPrevButton == true) {
        $scope.loadPrevQues();
      }
      $scope.displayQuestion = false;
      $scope.showRadioButton = false;
      $scope.showCheckboxOption = false;
      $scope.showRadioOption = false;
      $scope.showFillText = false;
      $scope.showTimer = false;
      $scope.exameHeader = false;

      updateExameTaken(userId);
      $location.path('/student');
    }

    var updateExameTaken = function (userId) {
      var exameList = userObj.exam;
      for (var i = 0; exameList.length; i++) {
        if (exameList[i] == exameId) {
          userObj.taken[i] = 1;
          break;
        }
      }
      AssessmentService.updateUserById(userId, userObj);
    }

    $scope.buttonClicked = function (value) {
      if (value == 1) {
        showAnswered();
      }
      else if (value == 2) {
        showUnanswered();
      }
      else {
        questionIds = totalQuestionIds;
      }
      $scope.showStartButton = false;
      $scope.displayQuestion = true;
      $scope.showRadioButton = true;
      $scope.showNextButton = true;
      $scope.showPrevButton = false;
      $scope.showCheckboxOption = false;
      $scope.showRadioOption = false;
      $scope.showFillText = false;

      ques_id_idx = 0;
      $scope.questionId = ques_id_idx + 1;

      if (questionIds.length > 0) {
        prevResponse = showCheckedUtil();
        displayOptionUtil();
        displayButtonUtil();
      }
      else {
        $scope.displayQuestion = false;
        $scope.showNextButton = false;


      }
    }

    var showAnswered = function () {
      var temp = [];
      for (var i = 0; i < totalQuestionIds.length; i++) {
        var response_text = hash[hashCode(userId, totalQuestionIds[i])].responseText;
        if (response_text && response_text.length > 0) {
          temp.push(totalQuestionIds[i]);
        }

      }

      questionIds = temp;
    }

    var showUnanswered = function () {
      var temp = [];
      for (var i = 0; i < totalQuestionIds.length; i++) {
        var response_text = hash[hashCode(userId, totalQuestionIds[i])].responseText;
        if (!response_text || response_text.length == 0) {
          temp.push(totalQuestionIds[i]);
        }

      }

      questionIds = temp;
    }

    AssessmentService.getExameById(exameId).then(function (result) {
      questionIds = result.data.listOfQuestions;
      totalQuestionIds = questionIds;
      $scope.totalQuestions = questionIds.length;
      $scope.totalUnanswered = questionIds.length;
      durations = parseInt(result.data.duration) * 60;
      $scope.nameOfExame = result.data.examName;
    });

    AssessmentService.getUserById(userId).then(function (result) {
      userObj = result.data;
    });




    AssessmentService.getAllQuestions().then(function (result) {
      questionList = result.data;
    });

    $scope.getBack = function () {
      $location.path('/student');
    }
    $scope.startAssessment = function () {
      $scope.showStartButton = false;
      $scope.displayQuestion = true;
      $scope.showRadioButton = true;
      $scope.showNextButton = true;
      $scope.showPrevButton = true;
      $scope.showTimer = true;
      $scope.exameHeader = true;




      var idx = 0;
      for (var i = 0; i < questionIds.length; i++) {
        var resObj = AssessmentService.insertResponse(userId, questionIds[i], "");
        resObj.success(function (data, status, headers, config) {

          hash[hashCode(userId, questionIds[idx])] = data;
          idx++;

        });
        resObj.error(function (data, status, headers, config) {
          alert("failure message: " + JSON.stringify({ data: data }));
          return undefined;
        });

      }

      ques_id_idx = 0;
      $scope.questionId = ques_id_idx + 1;

      $scope.question = question = questionList[questionIds[ques_id_idx]];
      $scope.showPrevButton = false;

      displayOptionUtil();

      var timer = setInterval(function () {
        durations--;
        $scope.hours = Math.floor((durations / (60 * 60)));
        $scope.minutes = Math.floor((durations % (60 * 60)) / (60));
        $scope.seconds = Math.floor((durations % 60));
        $scope.$apply();
        if (durations == 0) {
          alert("EXAM HAS ENDED!!");
          finishAssessment();
        }
      }, 1000);
    }

    $scope.loadPrevQues = function () {


      currentResponse = updateResponseUtil();
      updateCount();
      ques_id_idx -= 1;
      prevResponse = showCheckedUtil();
      displayOptionUtil();
      displayButtonUtil();
    }

    $scope.loadNextQues = function () {

      currentResponse = updateResponseUtil();
      updateCount();
      ques_id_idx += 1;
      prevResponse = showCheckedUtil();
      displayOptionUtil();
      displayButtonUtil();
    }

    var updateCount = function () {

      if (currentResponse && currentResponse.length > 0 && (!prevResponse || prevResponse.length == 0)) {
        $scope.totalAnswered += 1;
        $scope.totalUnanswered -= 1;
      }
      if ((!currentResponse || currentResponse.length == 0) && (prevResponse && prevResponse.length > 0)) {
        $scope.totalAnswered -= 1;
        $scope.totalUnanswered += 1;
      }
    }


    var updateResponseUtil = function () {
      var responseGiven = "";
      var inputElements = getInputElementsUtil();

      if (question.type == 'Single' || question.type == 'Multi') {


        for (var i = 0; inputElements[i]; i++) {
          if (inputElements[i].checked) {
            responseGiven += "$";
            responseGiven += i;
          }
        }
        if (responseGiven.length > 0) {
          responseGiven = responseGiven.substr(1, responseGiven.length);
        }
      }
      else {
        responseGiven = $scope.optionText;
      }
      var currentResponseObject = hash[hashCode(userId, questionIds[ques_id_idx])];

      currentResponseObject.responseText = responseGiven;

      hash[hashCode(userId, questionIds[ques_id_idx])] = currentResponseObject;

      AssessmentService.updateResponse(currentResponseObject.id, currentResponseObject);
      return responseGiven;
    }

    //function to show the checked options
    var showCheckedUtil = function () {
      $scope.question = question = questionList[questionIds[ques_id_idx]];
      $scope.questionId = ques_id_idx + 1;

      $(document).ready(function () {


        var responseObject = hash[hashCode(userId, questionIds[ques_id_idx])];

        var existingResponseText = responseObject.responseText;

        // first unchecked all checkbox
        if (question.type == 'Single' || question.type == 'Multi') {
          var inputElements = getInputElementsUtil();

          for (var i = 0; inputElements[i]; ++i) {
            inputElements[i].checked = false;
          }

          // check all value which is in responseText


          if (existingResponseText.length > 0) {
            var indices = existingResponseText.split("$");

            for (var i = 0; i < indices.length; i++) {
              var idx = parseInt(indices[i]);
              inputElements[idx].checked = true;

            }
          }
        }
        else {
          $scope.optionText = existingResponseText;
        }
      });
      return hash[hashCode(userId, questionIds[ques_id_idx])].responseText;
    }
    var displayOptionUtil = function () {
      if (question.type == 'Multi') {
        $scope.showRadioOption = false;
        $scope.showFillText = false;
        $scope.showCheckboxOption = true;
      }
      else if (question.type == 'Single') {
        $scope.showRadioOption = true;
        $scope.showFillText = false;
        $scope.showCheckboxOption = false;
      }
      else {
        $scope.showRadioOption = false;
        $scope.showCheckboxOption = false;
        $scope.showFillText = true;
      }
    }
    var getInputElementsUtil = function () {
      var inputElements;
      if (question.type == 'Multi') {
        inputElements = document.getElementsByClassName('optionCheckBox');
      }
      else if (question.type == 'Single') {
        inputElements = document.getElementsByClassName('optionRadio');
      }
      return inputElements;
    }
    var displayButtonUtil = function () {
      if (ques_id_idx + 1 >= questionIds.length) {
        $scope.showNextButton = false;
      } else {
        $scope.showNextButton = true;
      }
      if (ques_id_idx <= 0) {
        $scope.showPrevButton = false;
      } else {
        $scope.showPrevButton = true;
      }
    }

    var hashCode = function (userId, questionId) {

      return userId * 1000 + parseInt(questionId);
    }

  }); // Assessment Controller End.



})();
