(function(){
	var app = angular.module('admin_module', []);
	app.service('AdminService', function($http, $q,$rootScope) {
		
		this.readExaminees=function(callback){
			var lines1 = [];
			var f = document.getElementById('fileExaminnes').files[0],
        		r = new FileReader();
        		r.onloadend = function(e) {
      var data = e.target.result;
      // console.log(data)
      // console.log($scope.examName)

      var lines = data.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
    	callback(lines);
      //send your binary data via $http or $resource or do anything else with it
    }
    r.readAsText(f);
    
		}

		this.getExams = function() {
			var deferred= $q.defer();
			$http.get("http://localhost:3000/exam").then(function(result){
				deferred.resolve(result);
			},
			function(result){
            deferred.reject(result);
        });
        return deferred.promise;

		}

		this.updateExam = function(prev_object,start_time,end_time,duration) {
			var exam = {
	  "examName":prev_object.examName,				
      "startDate": start_time,
      "endDate": end_time,
      "duration": parseInt(duration),
      "listOfQuestions":prev_object.listOfQuestions
      }
      // console.log("the id is " + id);
      $http.put("http://localhost:3000/exam/"+prev_object.id,exam);


		}


		this.updateAdminExam = function(user,exam_id) {
			user.exam.push(exam_id)
			$http.put("http://localhost:3000/user/"+user.id, user)
		}

		this.addQuestion = function (qtext, type, marks, correctAnswer, listOfChoices) {
	      var dataObj = {
	        "questionText": qtext,
	        "marks": marks,
	        "correctAnswer": correctAnswer,
	        "listOfChoices": listOfChoices,
	        "type": type
	      }
	      var res = $http.post('http://localhost:3000/question/', dataObj);
	      return res
  		}

  		this.addExam = function (examName, listOfQuestions) {
	      var dataObj = {
	        "examName": examName,
	        "startDate": 0,
	        "endDate": 0,
	        "duration": 0,
	        "listOfQuestions": listOfQuestions
	      };
	      var res = $http.post('http://localhost:3000/exam/', dataObj);
	      return res
	      res.success(function (data, status, headers, config) {
	        console.log(data)
	        console.log("successfully registered");
	      });
	      res.error(function (data, status, headers, config) {
	        alert("failure message: " + JSON.stringify({ data: data }));
	      });
	    }

		this.updateUser = function(users,email_id,exam_id) {
			for(var i = 0;i<users.length;i++) {
				if(users[i].email == email_id) {
					break;
				}
				

			}
			var new_user = users[i];
			new_user.exam.push(exam_id);
			new_user.taken.push(0);
			$http.put("http://localhost:3000/user/"+users[i].id,new_user);
		}



	});
			 

})();