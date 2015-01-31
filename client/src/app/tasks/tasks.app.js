

angular.module('tasks.app', [
    'ui.router',
    'tasks.controller',
    'services',
    //'ui.bootstrap',
    'templates.app'
]);


angular.module('tasks.app').config(['$stateProvider', 
    function($stateProvider) {

    // TODO: https://github.com/angular-ui/ui-router/blob/master/sample/app/contacts/contacts.js
    $stateProvider

        .state('tasks', {
            abstract: true,
            url: '/tasks',
            templateUrl: 'tasks/tasks.tpl.html',
            //resolve: {
                //loggedin: checkLoggedin,
                //tasks: ['tasks',
                //    function( Tasks){
                //        return Tasks.all();
                //    }]
            //},
            controller: 'TasksListCtrl'
        })
        
        .state('tasks.list', {
            // example url: /tasks/ (taken from abstract base)
            url: '',
            templateUrl: 'tasks/tasks.list.tpl.html'
            //controller: 'TasksListCtl'
        })
        
        .state('tasks.detail', {
            // example url: /tasks/42 
            // $stateParams: { taskId: 42 }.
            url: '/{taskId}',
            
            views: {

                '': {
                    templateUrl: 'tasks/tasks.detail.tpl.html',
                    controller: 'TasksDetailCtrl'
                }
            }
        })
        
        
        .state('tasks.edit', {
            // example url: /tasks/42/edit 
            // $stateParams: { taskId: 42 }.
            url: '/{taskId}/edit',
            
            views: {

                '': {
                    templateUrl: 'tasks/tasks.edit.tpl.html',
                    controller: 'TasksEditCtrl'
                }
            }
        })
        
        .state('tasks.create', {
            // example url: /tasks/create 
            url: '/create',
            
            views: {

                '': {
                    templateUrl: 'tasks/tasks.edit.tpl.html',
                    controller: 'TasksEditCtrl'
                }
            }
        });

}]);
