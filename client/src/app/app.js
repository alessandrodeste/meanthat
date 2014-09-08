// app.js

angular.module('app', [
  'ui.router',
  'ui.bootstrap',
  'templates.app',
  'templates.common',
  'security',
  'app.staticpages',
  'app.main',
  //'admin',
  'services.breadcrumbs',
  //'services.i18nNotifications',
  'services.httpRequestTracker'
  //'directives.crud',
]);

// On Start application
angular.module('app').run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) { //security

    // Get the current user when the application starts
    // (in case they are still logged in from a previous session)
    //security.requestCurrentUser();

    // Globals for user states
    //$rootScope.$state = $state;
    //$rootScope.$stateParams = $stateParams;
}]);


angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
    $urlRouterProvider
        //.when('/c?id', '/contacts/:id')
        //.when('/user/:id', '/contacts/:id')
        .when('/', '/home')
        .otherwise('/home');
/*
  $stateProvider
    .state('home', {
      url: "home",
      templateUrl: "static/home.tpl.html"
      //controller:
    });*/
//    .state('route2', {
//      url: "/route2",
//      views: {
//        "viewA": { template: "route2.viewA" },
//        "viewB": { template: "route2.viewB" }
//      }
//    })
}]);


//TODO: move those messages to a separate module
angular.module('app').constant('I18N.MESSAGES', {
  'errors.route.changeError':'Route change error',
  'crud.user.save.success':"A user with id '{{id}}' was saved successfully.",
  'crud.user.remove.success':"A user with id '{{id}}' was removed successfully.",
  'crud.user.remove.error':"Something went wrong when removing user with id '{{id}}'.",
  'crud.user.save.error':"Something went wrong when saving a user...",
  'crud.project.save.success':"A project with id '{{id}}' was saved successfully.",
  'crud.project.remove.success':"A project with id '{{id}}' was removed successfully.",
  'crud.project.save.error':"Something went wrong when saving a project...",
  'login.reason.notAuthorized':"You do not have the necessary access permissions.  Do you want to login as someone else?",
  'login.reason.notAuthenticated':"You must be logged in to access this part of the application.",
  'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again.",
  'login.error.serverError': "There was a problem with authenticating: {{exception}}."
});


/*
angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/home'});
}]);



angular.module('app').controller('AppCtrl', ['$scope', 'i18nNotifications', 'localizedMessages', function($scope, i18nNotifications, localizedMessages) {

  $scope.notifications = i18nNotifications;

  $scope.removeNotification = function (notification) {
    i18nNotifications.remove(notification);
  };

  $scope.$on('$routeChangeError', function(event, current, previous, rejection){
    i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: rejection});
  });
}]);

angular.module('app').controller('HeaderCtrl', ['$scope', '$location', '$route', 'security', 'breadcrumbs', 'notifications', 'httpRequestTracker',
  function ($scope, $location, $route, security, breadcrumbs, notifications, httpRequestTracker) {
  $scope.location = $location;
  // TODO: $scope.breadcrumbs = breadcrumbs;

  // TODO: $scope.isAuthenticated = security.isAuthenticated;
  // TODO: $scope.isAdmin = security.isAdmin;

  $scope.home = function () {
    if (security.isAuthenticated()) {
      $location.path('/dashboard');
    } else {
      $location.path('/projectsinfo');
    }
  };

  $scope.isNavbarActive = function (navBarPath) {
    return navBarPath === breadcrumbs.getFirst().name;
  };

  $scope.hasPendingRequests = function () {
    return httpRequestTracker.hasPendingRequests();
  };
}]);
*/



/////////////////////////////////////

/*
angular.module('app').config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  
	$routeProvider
        .when('/home', {templateUrl: 'static/home.tpl.html', controller: 'HomeCtrl', title: 'Home'})

        .otherwise({redirectTo: '/home'});

    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');

 }]);
*/
/*




$rootScope.$on("$routeChangeSuccess", function(current) {
	var authRequired = $route.current && 
			$route.current.$route && 
			$route.current.$route.auth;
	if (authRequired && !signedIn.isSignedIn()) {
		growl.info("Authentication error",
					"You need to be signed in to view that page.<br/><br/>" +
					"Please sign in and we'll have you viewing that page in a jiffy");
		var currentUrl = $location.url();
		$location.url("/signin?redirect_url=" + encodeURIComponent(currentUrl));
	} 
});
*/

// TODO: register listener to watch route changes
//$rootScope.$on("$routeChangeStart", function(event, next, current) {
//  if ( $rootScope.loggedUser == null ) {
//    // no logged user, we should be going to #login
//    if ( next.templateUrl == "partials/login.html" ) {
//      // already going to #login, no redirect needed
//    } else {
//      // not going to #login, we should redirect now
//      $location.path( "/login" );
//    }
//  }         
//});