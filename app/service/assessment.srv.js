(function(){
    //$http is used to make http requests; $http is above ajax calls ; it makes coding easy because we dont need to bind variables here 
    //$q is a promise api ;for checking the $http response
    var app = angular.module('assessment_module', []);
    app.service("AssessmentService",function($http,$q){

    this.getExameById = function(exameId) { 
        var deferred = $q.defer();
        $http.get("http://localhost:3000/exam/" + exameId).then(function(result) {
            deferred.resolve(result);
        },
        function(result) {
            deferred.reject(result);
        });
        return deferred.promise;
    };

    this.getQuestionById = function(quesId) {
        var deferred = $q.defer();
        $http.get("http://localhost:3000/question/" + quesId).then(function(result) {
            deferred.resolve(result);
        },
        function(result) {
            deferred.reject(result);
        });
        return deferred.promise;
    };



    this.getUserById = function(userId) {
        var deferred = $q.defer();
        $http.get("http://localhost:3000/user/" + userId).then(function(result) {
            deferred.resolve(result);
        },
        function(result) {
            deferred.reject(result);
        });
        return deferred.promise;
    };

    this.updateUserById = function(userId, userObj) {
      $http.put("http://localhost:3000/user/" + userId, userObj);
    };

    this.getAllQuestions = function() {
        var deferred = $q.defer();
        $http.get("http://localhost:3000/question/").then(function(result) {
            deferred.resolve(result);
        },
        function(result) {
            deferred.reject(result);
        });
        return deferred.promise;
    };

    this.deleteResponse = function(id) {
      $http.delete("http://localhost:3000/responses/" + id);
    };
    
    this.updateResponse = function(id, response) {
      $http.put("http://localhost:3000/responses/" + id, response);
    };

    this.insertResponse = function(userId, questionId, responseText) {
        var responseObj = {
          "userId": userId,
          "questionId": questionId,
          "responseText": responseText
        };  
        var res = $http.post('http://localhost:3000/responses/', responseObj);
        return res;
        res.success(function(data, status, headers, config) {
            console.log("response successfully inserted.");
            return data;
        });
        res.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
            return undefined;
        }); 
    }


});
})();
