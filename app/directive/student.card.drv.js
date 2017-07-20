(function(){
angular.module("directive_module",[])
.directive("studentcardView",function(){
return {
    restrict:'E',  //restricted to used as templates only
    templateUrl:'app/templ/student.card.templ.html',  //can use template too . but only when template size is less. if templateUrl is used then to get the template it makes ajax call XmlHttprequest; cross origin problem . to put in template the model use ` card.templ.html code `
    scope:{
        examName:'=',  //if used =f then in html use f="customer.firstName" else use first="customer.firstName"
        examDetail:'=',  // = and < used for attributes(states)
        startDate:'=',
        endDate:'=',
        duration:'=',
        status:'=' ,
        showExamLink:'&',//& is used for behavior 
        isExamTaken:'&',
        taken:'=',
        setExamId:'&'
       
    }
}
});
})();
