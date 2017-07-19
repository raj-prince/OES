(function(){
  var app=angular.module("assessmentController_module",["assessment_module"]);    
    // Assessment Controller Begin.
  app.controller("AssessmentController",function($scope, $location, AssessmentService){

    $scope.showStartButton = true;
    $scope.displayQuestion = false;
    $scope.showRadioButton = false;
    $scope.options = [];

    var questionIds = [];
    ques_id_idx = 0;
    questionList = [];
    var userId = 1;
    var exameId = 1;

    // store (userId * 1000 + quesId) as key
    // response Object as value
    var hash = new Object();

    $scope.question = question = {};

    $scope.finishAssessment = function() {
      $location.path('/student');
    }

    AssessmentService.getExameById(1).then(function(result) {
      questionIds = result.data.listOfQuestions;
    });

    // AssessmentService.getQuestionById(1).then(function(result) {
    //   $scope.question = question = result.data;
    // });

    AssessmentService.getAllQuestions().then(function(result) {
      questionList = result.data;
    });

    $scope.startAssessment = function() {
      $scope.showStartButton = false;
      $scope.displayQuestion = true;
      $scope.showRadioButton = true;
      $scope.showNextButton = true;
      $scope.showPrevButton = true;



      // insert empty response for all question
      var idx = 0;
      for (var i = 0; i < questionIds.length; i++) {
        var resObj = AssessmentService.insertResponse(userId, questionIds[i], "");
        resObj.success(function(data, status, headers, config) {
            // console.log("response successfully inserted.");
            // console.log(idx1);
            // console.log(questionIds[idx1], questionIds[0]);
            // console.log(hashCode(userId, questionIds[idx1]));
            hash[hashCode(userId, questionIds[idx])] = data;
            idx++;
            console.log(data);
        });
        resObj.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
            return undefined;
        }); 
        // hash[hashCode(userId, questionIds[i])] = resObj;
        // console.log(resObj);
      }

      ques_id_idx = 0;
      $scope.question = question = questionList[questionIds[ques_id_idx]];
      $scope.options = question.listOfChoices;
      $scope.showPrevButton = false;
      // if (ques_id_idx == 0) {
      //   $scope.showPrevButton = false;
      // }
      // if (ques_id_idx + 1 == questionIds.length) {
      //   $scope.showNextButton = false;
      // }

    }

    $scope.loadPrevQues = function() {
      // code for operation on current question
      updateResponseUtil();
      ques_id_idx -= 1;
      // $scope.question = question = questionList[questionIds[ques_id_idx]];
      showCheckedUtil();
      displayButtonUtil();
    }

    $scope.loadNextQues = function() {

      updateResponseUtil();
      ques_id_idx += 1;
      showCheckedUtil();
      
      displayButtonUtil();
    }

    // code for operation on current question
    var updateResponseUtil = function() {
      var responseGiven = "";
      var inputElements = document.getElementsByClassName('optionCheckBox');
      for(var i = 0; inputElements[i]; i++){
        if(inputElements[i].checked){ 
            responseGiven += ",";
          responseGiven += i;
        }
      }
      if(responseGiven.length > 0){
        responseGiven = responseGiven.substr(1,responseGiven.length);
      }
      var currentResponseObject = hash[hashCode(userId, questionIds[ques_id_idx])];
  
      currentResponseObject.responseText = responseGiven;
      
      hash[hashCode(userId, questionIds[ques_id_idx])] = currentResponseObject;
      console.log("the text is "+currentResponseObject.responseText);
      AssessmentService.updateResponse(currentResponseObject.id, currentResponseObject);
    }

    //function to show the checked options
    var showCheckedUtil = function() {
      $scope.question = question = questionList[questionIds[ques_id_idx]];
      $scope.options = question.listOfChoices;

      var responseObject = hash[hashCode(userId, questionIds[ques_id_idx])];

      // first unchecked all checkbox
      var inputElements = document.getElementsByClassName('optionCheckBox');
      console.log("hi the length is " + inputElements.length);
      for(var i = 0; inputElements[i]; ++i){
        inputElements[i].checked = false;
      }

      // check all value which is in responseText
      var existingResponseText = responseObject.responseText;

      if(existingResponseText.length > 0 ) {
        var indices = existingResponseText.split(",");
      
        for (var i = 0; i < indices.length; i++) {
          var idx = parseInt(indices[i]);
          inputElements[idx].checked = true;

        }
      }
    }
    var displayButtonUtil = function() {
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

    var hashCode = function(userId, questionId) {
      console.log("nsj1");
      console.log(userId);
      console.log(questionId);
      return userId * 1000 + parseInt(questionId);
    }

}); // Assessment Controller End.

        

})();
