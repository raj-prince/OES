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
      "listOfQuestions":[]
      }
      // console.log("the id is " + id);
      $http.put("http://localhost:3000/exam/"+prev_object.id,exam);


		}

		this.updateUser = function(users,email_id,exam_id) {
			for(var i = 0;i<users.length;i++) {
				if(users[i].email == email_id) {
					break;
				}
				

			}
			var new_user = users[i];
			new_user.exam.push(exam_id);
			$http.put("http://localhost:3000/user/"+users[i].id,new_user);
		}



	});
			 

})();