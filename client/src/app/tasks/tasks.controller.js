
angular.module('tasks.controller', [
    'ui.router',
    'services',
    //'ui.bootstrap',
    'templates.app'
]);


angular.module('tasks.controller').controller('TasksListCtl', ['$scope', '$state', 'Tasks',
    function (  $scope,   $state,   Tasks) {
        
        $scope.loadTasks = function() {
            var tasks = Tasks.all(function(tasks) {
                $scope.tasks = tasks.items;
            });
        };
        
        $scope.loadTasks();
        
        $scope.goTo = function () {
            // FIXME
            $state.go('tasks.detail', { contactId: "1" });
        };
}]);
