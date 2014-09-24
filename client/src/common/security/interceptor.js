angular.module('security.interceptor', ['security.retryQueue'])

// This http interceptor listens for authentication failures
.factory('securityInterceptor', ['$injector', 'securityRetryQueue', function($injector, queue) {
  return function(promise) {
    // Intercept failed requests
    return promise.then(null, function(originalResponse) {
      if(originalResponse.status === 401) {
        // The request bounced because it was not authorized - add a new request to the retry queue
        promise = queue.pushRetryFn('unauthorized-server', function retryRequest() {
          // We must use $injector to get the $http service to prevent circular dependency
          return $injector.get('$http')(originalResponse.config);
        });
      }
      return promise;
    });
  };
}])

// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
.config(['$httpProvider', function($httpProvider) {
  // FIXME
  //$httpProvider.responseInterceptors.push(securityInterceptor);
  /*
  $httpProvider.responseInterceptors.push(
    function($q, $location) { 
      return function(promise) { 
        return promise.then( 
          // Success: just return the response 
          function(response){ return response; }, 
          // Error: check the error status to get only the 401 
          function(response) { 
            if (response.status === 401) {
              $location.url('/login'); 
            }
            return $q.reject(response); 
            
          } ); 
      };
    }); 
  */
}]);




/*
// Token in header...
// on login success: $window.sessionStorage.setItem('token', data.token);
// on login failed:  $window.sessionStorage.removeItem('token');
app.factory('AuthInterceptor', function ($window, $q) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.getItem('token')) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.getItem('token');
            }
            return config || $q.when(config);
        },
        response: function(response) {
            if (response.status === 401) {
                // TODO: Redirect user to login page.
            }
            return response || $q.when(response);
        }
    };
});

// Register the previously created AuthInterceptor.
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});


*/