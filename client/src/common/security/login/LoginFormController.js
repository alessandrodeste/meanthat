angular.module('security.login.form', [
    'services.localizedMessages', 
    'security.social.googleHelper'])

// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the security service.
.controller('LoginFormController', 
    ['$scope', 'security', 'localizedMessages', '$modalInstance', '$location', '$window', '$http', 'googleHelper',
        function($scope, security, localizedMessages, $modalInstance, $location, $window, $http, googleHelper) {
          
    // The model for this form 
    $scope.user = {};
    $scope.signedIn = false;
    
    // Any error message from failing to login
    $scope.authError = null;

    // FIXME
    // Attempt to authenticate the user specified in the form's model
    $scope.login = function() {
        // Clear any previous security errors
        $scope.authError = null;
        
        // Try to login
        security.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
          if ( !loggedIn ) {
            // If we get here then the login failed due to bad credentials
            $scope.authError = localizedMessages.get('login.error.invalidCredentials');
          }
        }, function(x) {
          // If we get here then there was a problem with the login request to the server
          $scope.authError = localizedMessages.get('login.error.serverError', { exception: x });
        });
    };
  
    // FIXME
    var login = function(email, password) {
        var request = $http.post('/login', {email: email, password: password});
        return request.then(function(response) {
            security.currentUser = response.data.user;
            if ( security.isAuthenticated() ) {
                closeLoginDialog(true);
            }
            return security.isAuthenticated();
        });
    };
    
    var closeLoginDialog = function(result)
    {
        $modalInstance.close(result);
    };

    $scope.clearForm = function() {
        $scope.user = {};
    };
    
    $scope.cancelLogin = function(res) {
        closeLoginDialog(false);
    };

  
    // ************************************************
    // ********************************** GOOGLE AUTH *
    // ************************************************
  
    // When callback is received, we need to process authentication.
    $scope.signInCallback = function(authResult) {
        $scope.$apply(function() {
            googleHelper.processAuth(authResult, $scope.userInfoCallback);
            if (googleHelper.signedIn)
            {
                closeLoginDialog();
            }
        });
    };
    
    // When callback is received, process user info.
    $scope.userInfoCallback = function(userInfo) {
      $scope.$apply(function() {
          googleHelper.processUserInfo(userInfo);
          $scope.signedIn = googleHelper.signedIn;
      });
    };

    // Render the sign in button.
    $scope.renderGoogleSignInButton = googleHelper.renderGoogleSignInButton;

    
}]);
