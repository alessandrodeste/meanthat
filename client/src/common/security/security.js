// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.service', [
        'security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
        'security.login',         // Contains the login form template and controller
        'ui.bootstrap'     // Used to display the login form as a modal dialog.
    ])

    .factory('security', ['$http', '$q', '$location', 'securityRetryQueue', '$modal', '$window', function($http, $q, $location, queue, $modal, $window) {

        //------------------------------------------------------------------
        // TOREM?
        // Redirect to the given url (defaults to '/')
        //------------------------------------------------------------------
        function redirect(url) {
            url = url || '/';
            $location.path(url);
        }

        //------------------------------------------------------------------
        // FIXME
        // Login form dialog stuff
        //------------------------------------------------------------------
        function onLoginDialogClose(success) {
            if ( success ) {
                queue.retryAll();
            } else {
                queue.cancelAll();
            }
        }
        
        //------------------------------------------------------------------
        // Open Dialog box
        //------------------------------------------------------------------
        function openDialog(isLogin) {
            var modalInstance;
            if (isLogin) {
                // is Sign in
                modalInstance = $modal.open({
                    templateUrl: 'security/login/form.tpl.html',
                    controller: 'SignInFormCtrl'
                });
            } else {
                // is Sign up
                modalInstance = $modal.open({
                    templateUrl: 'security/login/form.tpl.html',
                    controller: 'SignUpFormCtrl'
                });
            }
            modalInstance.result.then(onLoginDialogClose);
        }

        //------------------------------------------------------------------
        // FIXME
        // Register a handler for when an item is added to the retry queue
        //------------------------------------------------------------------
        queue.onItemAddedCallbacks.push(function(retryItem) {
            if ( queue.hasMore() ) {
                service.showLogin();
            }
        });

        //
        // The public API of the service
        //
        var service = {

            //-------------------------------------------------------------------
            // Show the modal login dialog
            //-------------------------------------------------------------------
            showLogin: function() {
                openDialog(true);
            },

            //-------------------------------------------------------------------
            // Show the modal login dialog
            //-------------------------------------------------------------------
            showSignup: function() {
                openDialog(false);
            },

            //-------------------------------------------------------------------
            // Attempt to authenticate a user by the given email and password
            //-------------------------------------------------------------------
            login: function(email, password) {
                var request = $http.post('/login', {email: email, password: password});
                return request.then(function(response) {

                    // Store token!
                    $window.sessionStorage.token = response.data.token;

                    service.currentUser = null;
                    var request = $http.get('/api/secured/loggedin');
                    return request.then(function(response) {

                        service.currentUser = response.data.user;

                        return service.isAuthenticated();
                    });
                });
            },

            //-------------------------------------------------------------------
            // Logout the current user and redirect
            //-------------------------------------------------------------------
            logout: function(redirectTo) {
                $http.post('/logout').then(function() {
                    service.currentUser = null;
                    // FIXME: redirect(redirectTo);
                });
            },

            //-------------------------------------------------------------------
            // Ask the backend to see if a user is already authenticated - this may be from a previous session.
            //-------------------------------------------------------------------
            requestCurrentUser: function() {
                if ( service.isAuthenticated() ) {
                    return $q.when(service.currentUser);
                } else {
                    return $http.get('/current-user').then(function(response) {
                        service.currentUser = response.data.user;
                        return service.currentUser;
                    });
                }
            },

            //-------------------------------------------------------------------
            // Information about the current user
            //-------------------------------------------------------------------
            currentUser: null,

            //-------------------------------------------------------------------
            // Is the current user authenticated?
            //-------------------------------------------------------------------
            isAuthenticated: function(){
                return !!service.currentUser;
            },

            //-------------------------------------------------------------------
            // Is the current user an adminstrator?
            //-------------------------------------------------------------------
            isAdmin: function() {
                return !!(service.currentUser && service.currentUser.admin);
            }
        };

        return service;
    }]);