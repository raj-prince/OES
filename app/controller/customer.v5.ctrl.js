(function(){
	var app=angular.module("customer_module",["directive_module","service_module"]);               //[] used for injecting modules

app.controller("StudentExamListController",function($scope,StudentService){ 

   // $scope.examsId=examsId=[];
   // $scope.user=user=[];
   //      StudentService.getStudent().then(function(result){
   //         $scope.examsId=examsId=result.data.exam;
   //         console.log(examsId)
   //         $scope.user=result.data;
           
   //      });
   //  $scope.examsId=examsId;
   //  $scope.user=user;

   // $scope.examsToShow=examsToShow=[];
    $scope.exams=exams=[];
    StudentService.getExams().then(function(result){
            $scope.exams=exams=result.data;
            // console.log(exams)
        // for(var i=0;i<exams.length;i++){
          // for(var j=0;j<examsId.length;j++){
            // console.log(exams[i].id, examsId[j])
            // if(exams[i].id==examsId[j]){
              // examsToShow.push(exams[i]);
              // examsId[j]=-1;
            // }
          // }
        // }
   

        });
        // console.log('hehid')
        $scope.exams=exams;
        // console.log(exams, examsToShow)
        // $scope.examsToShow=examsToShow;

});
})();