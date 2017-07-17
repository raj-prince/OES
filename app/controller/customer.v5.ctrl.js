(function(){
	var app=angular.module("customer_module",["directive_module","service_module"]);               //[] used for injecting modules

app.controller("StudentExamListController",function($scope,StudentService){ 

   $scope.examsId=examsId=[];
   $scope.user=user=[];
        StudentService.getStudent().then(function(result){
           $scope.examsId=examsId=result.data.exam;
           $scope.user=result.data;
           
        });
    $scope.examsId=examsId;
    $scope.user=user;

   $scope.examsToShow=examsToShow=[];
    $scope.exams=exams=[];
    StudentService.getExams().then(function(result){
            $scope.exams=exams=result.data;

        for(var i=0;i<exams.length;i++){
          for(var j=0;j<examsId.length;j++){
            if(exams[i].id==examsId[j].id){
              examsToShow.push(exams[i]);
              examsId[j].id=-1;
            }
          }
        }
   

        });
        $scope.exams=exams;
        $scope.examsToShow=examsToShow;

});
})();