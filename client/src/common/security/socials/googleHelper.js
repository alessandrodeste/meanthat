//
// Google client api Facet
//
angular.module('security.social.googleHelper', [
    'app.config', 
    'services'])

//
// Usage Example:
// 
// googleHelper.init();
//
// <span id="googleSignIn" ng-init="renderGoogleSignInButton(signInCallback)">
//      <span id="signInButton">
//      </span>
// </span>
//
//    // When callback is received, we need to process authentication.
//    $scope.signInCallback = function(authResult) {
//        $scope.$apply(function() {
//            googleHelper.signInCallback(authResult, $scope.userInfoCallback);
//            if (googleHelper.signedIn)
//            {
//                closeLoginDialog();
//            }
//        });
//    };
//    
//    // When callback is received, process user info.
//    $scope.userInfoCallback = function(userInfo) {
//      $scope.$apply(function() {
//          googleHelper.processUserInfo(userInfo);
//          $scope.signedIn = googleHelper.signedIn;
//      });
//    };
//
//    // Render the sign in button.
//    $scope.renderGoogleSignInButton = googleHelper.renderGoogleSignInButton;
//
.factory('googleHelper', ['CONFIG_SERVICES', 'security', '$window', function(CONFIG_SERVICES, security, $window) {

    // 
    // Private Functions
    //
    
    //------------------------------------------------------------------
    // Ok, I'm logged. Wait for server checks
    //------------------------------------------------------------------
    var serverCallback = function(access_token, callbackUserInfo) {

        var googleResult = security.google.callback({
                access_token:   access_token, 
                client_id:      CONFIG_SERVICES.google.client_id},
                
            // Success
            function(result) {
            
                security.loginSuccess(result.token, function() {
                    // If needed, get additional info from services
                    if (callbackUserInfo && typeof (callbackUserInfo) === 'function')
                    {
                        googleHelper.getUserInfo(callbackUserInfo);
                    }
                });
               
            },
            // Error
            function(error) {
                console.log("logged out");
                
                // Remove session token
                delete $window.sessionStorage.token;
            }
        );
    };
    
    //
    // Public functions
    //
    var googleHelper = {
       
            signedIn: false,
            
            //------------------------------------------------------------------
            // Inizializations of google library (gapi)
            //------------------------------------------------------------------
            init: function() {
                // Asynchronously load the G+ SDK.
                var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
                po.src = 'https://apis.google.com/js/client:plusone.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
                
                var po2 = document.createElement('script'); po2.type = 'text/javascript'; po2.async = false;
                po2.src = 'https://apis.google.com/js/client.js?onload=handleClientLoad';
                var s2 = document.getElementsByTagName('script')[0]; s2.parentNode.insertBefore(po2, s2);
            },
            
            //------------------------------------------------------------------
            // Callback from google services: check results
            //------------------------------------------------------------------
            signInCallback: function(authResult, callbackUserInfo) {
                // Do a check if authentication has been successful.
                if(authResult['access_token']) {
                    
                    // Successful sign in.
                    googleHelper.signedIn = true;

                    // Callback to server: upsert info recieved
                    serverCallback(authResult['access_token'], callbackUserInfo);
                    
                } else if(authResult['error']) {
                    
                    // Error while signing in.
                    googleHelper.signedIn = false;
         
                    // TODO: Report error.
                    console.log('Error login google');
                }
            },
            
            //------------------------------------------------------------------
            // Process user info
            //------------------------------------------------------------------
            processUserInfo: function(userInfo) {
              
              // TODO
              console.log('user infos retrieve!', userInfo);
              //userInfo['emails'][0]['value']
              
            },
            
            //------------------------------------------------------------------
            // Render Google+ Button
            //------------------------------------------------------------------
            renderGoogleSignInButton: function(callback) {
    
                gapi.signin.render('signInButton',
                    {
                        'callback': callback, // Function handling the callback.
                        'clientid': CONFIG_SERVICES.google.client_id, // CLIENT_ID from developer console which has been explained earlier.
                        'requestvisibleactions': 'http://schemas.google.com/AddActivity', // Visible actions, scope and cookie policy wont be described now,
                                                                                          // as their explanation is available in Google+ API Documentation.
                        'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
                        'cookiepolicy': 'single_host_origin'
                    }
                );
            },
            
            //------------------------------------------------------------------
            // Request user info.
            //------------------------------------------------------------------
            getUserInfo: function(callback) {
              gapi.client.request(
                  {
                      'path':'/plus/v1/people/me',
                      'method':'GET',
                      'callback': callback
                  }
              );
            },
            
            //------------------------------------------------------------------
            // Sign out from google services
            //------------------------------------------------------------------
            logout: function()
            {
                gapi.auth.signOut();
            }
            

   };
   
   
   return googleHelper;
}]);


