


angular.module('app.main', [
    'services.breadcrumbs'
   // 'ngRoute',
   // 'services',
   // 'ui.bootstrap',
   // 'templates.app'
]);

angular.module('app.main').controller('HeaderCtrl', ['$rootScope', '$scope', '$location', 'breadcrumbs', function ($rootScope, $scope, $location, breadcrumbs) {

    $scope.breadcrumbs = breadcrumbs;

    /* TOREM
    $scope.navClass = function (page) {
        var tokens = $location.path().split("/");
        return (tokens.length>1 && page === tokens[1]) ? 'active' : ''; // based on first token of the route
    };
    */

    $scope.isNavbarActive = function (navBarPath) {
        return navBarPath === breadcrumbs.getFirst().name;
    };

}]);

angular.module('app.main').controller('FooterCtrl', ['$scope', '$location', function ($scope, $location) {

}]);


angular.module('app.main').controller('AppCtrl', ['$scope', function($scope) {


}]);
