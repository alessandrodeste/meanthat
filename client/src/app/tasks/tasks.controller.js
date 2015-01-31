
angular.module('tasks.controller', [
    'ui.router',
    'services',
    //'ui.bootstrap',
    'templates.app'
])


.controller('TasksListCtrl', ['$scope', '$state', 'Tasks',
    function ($scope, $state, Tasks) {
        
        loadTasks = function() {
            var tasks = Tasks.all(function(tasks) {
                $scope.tasks = tasks;
            });
        };
        loadTasks();
        
        $scope.goTo = function (id) {
            $state.go('tasks.detail', { taskId: id });
        };
}])

.controller('TasksDetailCtrl', ['$scope', '$stateParams', '$state', 'Tasks',
    function ($scope, $stateParams, $state, Tasks) {
        
        loadTask = function() {
            var task = Tasks.get({id: $stateParams.taskId}, function(task) {
                $scope.task = task;
            });
        };
        loadTask();
        
        
}])


.controller('TasksEditCtrl', ['$scope', '$stateParams', '$state', 'Tasks',
    function ($scope, $stateParams, $state, Tasks) {
        
        $scope.isNew = true;
        
        if ($stateParams.taskId) {
            // Edit
            $scope.isNew = false;
            loadTask = function() {
                var task = Tasks.get({id: $stateParams.taskId}, function(task) {
                    $scope.task = task;
                });
            };
            loadTask();
            
        } else {
            // Create
            $scope.task = {};
        }
        
        
        $scope.save = function() {
            Tasks.save($scope.task, function(data) {
                alert("saved? " + data);
            });
        };
}]);