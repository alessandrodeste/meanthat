angular.module('security.login.form', ['services.localizedMessages', 'app.config'])

// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the security service.
.controller('LoginFormController', ['$scope', 'security', 'localizedMessages', '$modalInstance', '$location', '$window', '$http', 'CONFIG_SERVICES', 
        function($scope, security, localizedMessages, $modalInstance, $location, $window, $http, CONFIG_SERVICES) {
          
  // The model for this form 
  $scope.user = {};

  // Any error message from failing to login
  $scope.authError = null;

  // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
  // We could do something diffent for each reason here but to keep it simple...
  $scope.authReason = null;
  if ( security.getLoginReason() ) {
    $scope.authReason = ( security.isAuthenticated() ) ?
      localizedMessages.get('login.reason.notAuthorized') :
      localizedMessages.get('login.reason.notAuthenticated');
  }

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
      // if result true: go user home else go generic home
      //if (result)
        //$location.path('/');
    };

  $scope.clearForm = function() {
    $scope.user = {};
  };

  $scope.cancelLogin = function(res) {
    closeLoginDialog(false);
  };
  
  $scope.loginGoogle = function() {
    $window.location.href = '/auth/google';
  };
  
  
  
  // ********************************** GOOGLE AUTH
  
  
  // This flag we use to show or hide the button in our HTML.
    $scope.signedIn = false;
 
    // Here we do the authentication processing and error handling.
    // Note that authResult is a JSON object.
    $scope.processAuth = function(authResult) {
        // Do a check if authentication has been successful.
        if(authResult['access_token']) {
            // Successful sign in.
            $scope.signedIn = true;
 
            //     ...
            // Do some work [1].
            //     ...
            
            console.log('login google', authResult);
            $scope.getUserInfo();
        } else if(authResult['error']) {
            // Error while signing in.
            $scope.signedIn = false;
 
            // Report error.
            console.log('Error login google');
        }
    };
 
    // When callback is received, we need to process authentication.
    $scope.signInCallback = function(authResult) {
        $scope.$apply(function() {
            $scope.processAuth(authResult);
        });
    };
 
    // Render the sign in button.
    $scope.renderSignInButton = function() {
        gapi.signin.render('signInButton',
            {
                'callback': $scope.signInCallback, // Function handling the callback.
                'clientid': CONFIG_SERVICES.google.client_id, // CLIENT_ID from developer console which has been explained earlier.
                'requestvisibleactions': 'http://schemas.google.com/AddActivity', // Visible actions, scope and cookie policy wont be described now,
                                                                                  // as their explanation is available in Google+ API Documentation.
                'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
                'cookiepolicy': 'single_host_origin'
            }
        );
    };
 
    // Start function in this example only renders the sign in button.
    $scope.start = function() {
        $scope.renderSignInButton();
    };
 
    // Call start function on load.
   // $scope.start();
  
  
    // Process user info.
    // userInfo is a JSON object.
    $scope.processUserInfo = function(userInfo) {
      // You can check user info for domain.
      if(userInfo['domain'] === 'mycompanydomain.com') {
          // Hello colleague!
      }
      console.log('user infos retrieve!');
      //userInfo['emails'][0]['value']
    };
    
    // When callback is received, process user info.
    $scope.userInfoCallback = function(userInfo) {
      $scope.$apply(function() {
          $scope.processUserInfo(userInfo);
      });
    };
    
    // Request user info.
    $scope.getUserInfo = function() {
      gapi.client.request(
          {
              'path':'/plus/v1/people/me',
              'method':'GET',
              'callback': $scope.userInfoCallback
          }
      );
    };
    
    // TODO: signout!
    // gapi.auth.signOut();
  
  
}]);
