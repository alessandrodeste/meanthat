angular.module('security.login', [
    'services.localizedMessages', 
    'security.social.googleHelper'])

    .factory('LoginFormCtrlCommons', function () {
        var root = {};

        // ------------------------------------------------------------------
        // Close modal dialog
        // ------------------------------------------------------------------
        root.closeLoginDialog = function($modalInstance) {
            return function(result)
            {
                $modalInstance.close(result);
            };
        };

        // ------------------------------------------------------------------
        // Attempt to authenticate the user specified in the form's model
        // ------------------------------------------------------------------
        root.login = function($scope, security, localizedMessages, closeLoginDialog) {
            return function() {

                // Clear any previous security errors
                $scope.authError = null;

                // Try to login
                security.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
                    if ( !loggedIn ) {
                        // If we get here then the login failed due to bad credentials
                        $scope.authError = localizedMessages.get('login.error.invalidCredentials');
                    } else {
                        closeLoginDialog(true);
                    }

                }, function(err) {
                    // If we get here then there was a problem with the login request to the server
                    $scope.authError = localizedMessages.get('login.error.serverError', { exception: err.data.message });
                });
            };
        };

        // ------------------------------------------------------------------
        // Attempt to create new user
        // ------------------------------------------------------------------
        root.signup = function($scope, security, localizedMessages, closeLoginDialog) {
            return function() {

                // Clear any previous security errors
                $scope.authError = null;

                // Try to login
                security.signup($scope.user.email, $scope.user.password).then(function(loggedIn) {
                    if ( !loggedIn ) {
                        // If we get here then the login failed due to bad credentials
                        $scope.authError = localizedMessages.get('login.error.invalidCredentials');
                    } else {
                        closeLoginDialog(true);
                    }

                }, function(x) {
                    // If we get here then there was a problem with the login request to the server
                    $scope.authError = localizedMessages.get('login.error.serverError', { exception: x });
                });
            };
        };
        // ------------------------------------------------------------------
        // GOOGLE AUTHENTICATION
        // When callback is received, we need to process authentication.
        // ------------------------------------------------------------------
        root.signInCallback = function($scope, googleHelper, closeLoginDialog) {
            return function(authResult) {
                $scope.$apply(function() {
                    googleHelper.signInCallback(authResult, $scope.userInfoCallback);
                    if (googleHelper.signedIn)
                    {
                        closeLoginDialog();
                    }
                });
            };
        };

        // ------------------------------------------------------------------
        // GOOGLE AUTHENTICATION
        // When callback is received, process user info.
        // ------------------------------------------------------------------
        root.userInfoCallback = function($scope, googleHelper) {
            return function(userInfo) {
                $scope.$apply(function() {
                    googleHelper.processUserInfo(userInfo);
                });
            };
        };

        return root;
    })

    .controller('SignInFormCtrl',
    ['$scope', 'security', 'localizedMessages', '$modalInstance', '$location', '$window', '$http', 'googleHelper', 'LoginFormCtrlCommons',
        function($scope, security, localizedMessages, $modalInstance, $location, $window, $http, googleHelper, LoginFormCtrlCommons) {

            // The model for this form
            $scope.user = {};
            // Error messages from login action
            $scope.authError = null;
            // Is login or signup
            $scope.isLogin = true;

            // ------------------------------------------------------------------
            // Close modal dialog
            // ------------------------------------------------------------------
            var closeLoginDialog = LoginFormCtrlCommons.closeLoginDialog($modalInstance);

            // ------------------------------------------------------------------
            // Attempt to authenticate the user specified in the form's model
            // ------------------------------------------------------------------
            $scope.login = LoginFormCtrlCommons.login($scope, security, localizedMessages, closeLoginDialog);

            // ------------------------------------------------------------------
            // Clear Form
            // ------------------------------------------------------------------
            $scope.clearForm = function() {$scope.user = {};};

            // ------------------------------------------------------------------
            // Cancel Login
            // ------------------------------------------------------------------
            $scope.cancelLogin = LoginFormCtrlCommons.closeLoginDialog($modalInstance);

            // ------------------------------------------------------------------
            // GOOGLE AUTHENTICATION
            // When callback is received, we need to process authentication.
            // ------------------------------------------------------------------
            $scope.signInCallback = LoginFormCtrlCommons.signInCallback($scope, googleHelper, closeLoginDialog);

            // ------------------------------------------------------------------
            // GOOGLE AUTHENTICATION
            // When callback is received, process user info.
            // ------------------------------------------------------------------
            $scope.userInfoCallback = LoginFormCtrlCommons.userInfoCallback($scope, googleHelper);

            // ------------------------------------------------------------------
            // GOOGLE AUTHENTICATION
            // Render the sign in button.
            // ------------------------------------------------------------------
            $scope.renderGoogleSignInButton = googleHelper.renderGoogleSignInButton;


        }])

    .controller('SignUpFormCtrl',
    ['$scope', 'security', 'localizedMessages', '$modalInstance', '$location', '$window', '$http', 'googleHelper', 'LoginFormCtrlCommons',
        function($scope, security, localizedMessages, $modalInstance, $location, $window, $http, googleHelper, LoginFormCtrlCommons) {

            // The model for this form
            $scope.user = {};
            // Error messages from login action
            $scope.authError = null;
            // Is login or signup
            $scope.isLogin = false;

            // ------------------------------------------------------------------
            // Close modal dialog
            // ------------------------------------------------------------------
            var closeLoginDialog = LoginFormCtrlCommons.closeLoginDialog($modalInstance);

            // ------------------------------------------------------------------
            // Attempt to create new user
            // ------------------------------------------------------------------
            $scope.signup = LoginFormCtrlCommons.signup($scope, security, localizedMessages, closeLoginDialog);

            // ------------------------------------------------------------------
            // Clear Form
            // ------------------------------------------------------------------
            $scope.clearForm = function() {$scope.user = {};};

            // ------------------------------------------------------------------
            // Cancel Login
            // ------------------------------------------------------------------
            $scope.cancelLogin = LoginFormCtrlCommons.closeLoginDialog($modalInstance);

            // ------------------------------------------------------------------
            // GOOGLE AUTHENTICATION
            // When callback is received, we need to process authentication.
            // ------------------------------------------------------------------
            $scope.signInCallback = LoginFormCtrlCommons.signInCallback($scope, googleHelper, closeLoginDialog);

            // ------------------------------------------------------------------
            // GOOGLE AUTHENTICATION
            // When callback is received, process user info.
            // ------------------------------------------------------------------
            $scope.userInfoCallback = LoginFormCtrlCommons.userInfoCallback($scope, googleHelper);

            // ------------------------------------------------------------------
            // GOOGLE AUTHENTICATION
            // Render the sign in button.
            // ------------------------------------------------------------------
            $scope.renderGoogleSignInButton = googleHelper.renderGoogleSignInButton;

        }]);

