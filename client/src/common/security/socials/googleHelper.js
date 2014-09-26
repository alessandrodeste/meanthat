

angular.module('security.social.googleHelper', [
    'app.config', 
    'services'])

//
// Use: googleHelper.init();
//
// <span id="googleSignIn" ng-init="renderGoogleSignInButton(signInCallback)">
//      <span id="signInButton">
//      </span>
// </span>
//
    .factory('googleHelper', ['CONFIG_SERVICES', 'Security', '$window', function(CONFIG_SERVICES, Security, $window) {
       
        var serverCallback = function(access_token, callbackUserInfo) {
            console.log("at:", access_token);
            var googleResult = Security.google.callback({'access_token': access_token}, {id: access_token},
                // Success
                function(result) {
                
                    // FIXME: check on results
                    console.log("loggato!? wow!");
                    console.log(result);
                    console.log("token? --> ", result.token);
                    
                    $window.sessionStorage.token = result.token;
                    
                    if (callbackUserInfo && typeof (callbackUserInfo) === 'function')
                    {
                        googleHelper.getUserInfo(callbackUserInfo);
                    }
                },
                // Error
                function(error) {
                    console.log("logged out");
                    
                    // Remove session token
                    delete $window.sessionStorage.token;
                }
            );
        };
        
        
        var googleHelper = {
           
                signedIn: false,
                
                init: function() {
                    // Asynchronously load the G+ SDK.
                    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
                    po.src = 'https://apis.google.com/js/client:plusone.js';
                    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
                    
                    var po2 = document.createElement('script'); po2.type = 'text/javascript'; po2.async = false;
                    po2.src = 'https://apis.google.com/js/client.js?onload=handleClientLoad';
                    var s2 = document.getElementsByTagName('script')[0]; s2.parentNode.insertBefore(po2, s2);
                
                },
                
       
               processAuth: function(authResult, callbackUserInfo) {
                    // Do a check if authentication has been successful.
                    if(authResult['access_token']) {
                        // Successful sign in.
                        googleHelper.signedIn = true;
             
                        // TODO...
                        console.log('login google', authResult);
                        
                        // Callback to server: upsert info recieved
                        serverCallback(authResult['access_token'], callbackUserInfo);
                        
                        
                    } else if(authResult['error']) {
                        
                        // Error while signing in.
                        googleHelper.signedIn = false;
             
                        // TODO: Report error.
                        console.log('Error login google');
                    }
                },
                
                // Process user info.
                // userInfo is a JSON object.
                processUserInfo: function(userInfo) {
                  
                  // TODO
                  console.log('user infos retrieve!', userInfo);
                  //userInfo['emails'][0]['value']
                  
                },
                
                // Render Google+ Button
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
                
                // Request user info.
                getUserInfo: function(callback) {
                  gapi.client.request(
                      {
                          'path':'/plus/v1/people/me',
                          'method':'GET',
                          'callback': callback
                      }
                  );
                },
                
                logout: function()
                {
                    gapi.auth.signOut();
                }
                
    
       };
       
       
       return googleHelper;
    }]);


