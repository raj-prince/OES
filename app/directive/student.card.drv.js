(function () {
    angular.module("directive_module", [])
        .directive("studentcardView", function () {
            return {
                restrict: 'E',
                templateUrl: 'app/templ/student.card.templ.html',
                scope: {
                    examName: '=',
                    examDetail: '=',
                    startDate: '=',
                    endDate: '=',
                    duration: '=',
                    status: '=',
                    showExamLink: '&',
                    taken: '=',
                    setExamId: '&'
                   

                }
            }
        });
})();
