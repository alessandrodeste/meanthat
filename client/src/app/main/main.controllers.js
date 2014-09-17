// main.controllers.js

angular.module('app.main', [
    'security',
    'services.httpRequestTracker',
    'services.breadcrumbs'
   // 'ngRoute',
   // 'services',
   // 'ui.bootstrap',
   // 'templates.app'
]);

angular.module('app.main').controller('HeaderCtrl', ['$rootScope', '$scope', '$location', 'breadcrumbs', 'security', 'httpRequestTracker',
    function ($rootScope, $scope, $location, breadcrumbs, security, httpRequestTracker) {

    $scope.isAuthenticated = security.isAuthenticated;
    $scope.isAdmin = security.isAdmin;
    $scope.showLogin = security.showLogin;

    $scope.breadcrumbs = breadcrumbs;

    $scope.isNavbarActive = function (navBarPath) {
        return navBarPath === breadcrumbs.getFirst().name;
    };

    $scope.hasPendingRequests = function () {
        return httpRequestTracker.hasPendingRequests();
    };
}]);

angular.module('app.main').controller('FooterCtrl', ['$scope', '$location', function ($scope, $location) {

}]);


angular.module('app.main').controller('AppCtrl', ['$scope', function($scope) {


}]);
