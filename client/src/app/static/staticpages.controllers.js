
angular.module('app.staticpages', [
    'ui.router',
    //'services',
    //'ui.bootstrap',
    'templates.app'
]);

angular.module('app.staticpages').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "static/home.tpl.html",
            controller: "HomeCtrl"
        })

        .state('about', {
            url: "/about",
            templateUrl: "static/about.tpl.html"
        });

}]);

angular.module('app.staticpages').controller('HomeCtrl', ['$scope', function($scope) {


}]);
