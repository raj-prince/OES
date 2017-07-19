(function(){
  var app=angular.module("assessmentController_module",["assessment_module"]);    
    // Assessment Controller Begin.
  app.controller("AssessmentController",function($scope, $location, AssessmentService){

    $scope.showStartButton = true;
    $scope.displayQuestion = false;
    $scope.showRadioButton = false;
    $scope.totalQuestions = 0;
    $scope.totalAnswered = 0;
    $scope.totalUnanswered = 0;
    $scope.options = [];

    var questionIds = [];
    var totalQuestionIds = [];
    ques_id_idx = 0;
    questionList = [];
    var userId = 1;
    var exameId = 1;

    var prevResponse = "";
    var currentResponse = "";
    // store (userId * 1000 + quesId) as key
    // response Object as value
    var hash = new Object();

    $scope.question = question = {};

    $scope.finishAssessment = function() {
      $location.path('/student');
    }
    // document.getElementById("answered").click(function(){


    //   console.log("yo clicked the button");
    // });
    $scope.buttonClicked = function(value) {
     if(value == 1) {
      showAnswered();
     }
     else if(value == 2) {
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
      
      // currentResponse = "";
      ques_id_idx = 0;
      // prevResponse = hash[hashCode(userId, questionIds[ques_id_idx])].responseText;
      // $scope.question = question = questionList[questionIds[ques_id_idx]];
      if(questionIds.length > 0){
     prevResponse =  showCheckedUtil();
    }
    else {
      $scope.displayQuestion = false;
      $scope.showNextButton = false;
    }
    }

    var showAnswered = function() {
      var temp = [];
      for(var i =0;i<totalQuestionIds.length;i++) {
        if(hash[hashCode(userId, totalQuestionIds[i])].responseText.length > 0) {
          temp.push(totalQuestionIds[i]);
        }

      }
      console.log(temp);
      questionIds = temp;
    }

    var showUnanswered = function() {
      var temp = [];
      for(var i =0;i<totalQuestionIds.length;i++) {
        if(hash[hashCode(userId, totalQuestionIds[i])].responseText.length == 0) {
          temp.push(totalQuestionIds[i]);
        }

      }
      console.log(temp);
      questionIds = temp;
    }

    AssessmentService.getExameById(1).then(function(result) {
      questionIds = result.data.listOfQuestions;
      totalQuestionIds = questionIds;
      $scope.totalQuestions = questionIds.length;
      $scope.totalUnanswered = questionIds.length;
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
      currentResponse = updateResponseUtil();
      updateCount();
      ques_id_idx -= 1;
      // $scope.question = question = questionList[questionIds[ques_id_idx]];
      prevResponse = showCheckedUtil();
      displayButtonUtil();
    }

    $scope.loadNextQues = function() {

      currentResponse = updateResponseUtil();
      updateCount();
      ques_id_idx += 1;
      prevResponse = showCheckedUtil();
      
      displayButtonUtil();
    }

    var updateCount = function() {
      console.log("the previous response is " + prevResponse);
      console.log("the currentResponse is " + currentResponse);
      if(currentResponse.length>0 && prevResponse.length==0) {
        $scope.totalAnswered +=1;
        $scope.totalUnanswered-=1;
      }
      if(currentResponse.length==0 && prevResponse.length >0) {
        $scope.totalAnswered -=1;
        $scope.totalUnanswered +=1;
      }
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
      return responseGiven;
    }

    //function to show the checked options
    var showCheckedUtil = function() {
      $scope.question = question = questionList[questionIds[ques_id_idx]];
      
      $(document).ready(function() {

      // // await sleep(2000);
      // for(var i =0;i<1000000000;i++) {

      // }
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
    });
      return hash[hashCode(userId, questionIds[ques_id_idx])].responseText;
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
