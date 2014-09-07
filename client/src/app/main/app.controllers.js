


angular.module('main', [
   // 'ngRoute',
   // 'services',
   // 'ui.bootstrap',
   // 'templates.app'
]);

angular.module('main').controller('HeaderCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {


    $scope.navClass = function (page) {
        var tokens = $location.path().split("/");
        return (tokens.length>1 && page === tokens[1]) ? 'active' : ''; // based on first token of the route
    };

}]);

angular.module('main').controller('FooterCtrl', ['$scope', '$location', function ($scope, $location) {

}]);


angular.module('main').controller('AppCtrl', ['$scope', function($scope) {


}]);
