(function() {
  "use strict";
  
  angular
    .module("app.auth")
    .factory("tokenInterceptor", tokenInterceptor);
  
  tokenInterceptor.$inject = ["$injector", "$q", "$timeout"];
  /* @ngInject */
  function tokenInterceptor($injector, $q, $timeout) {
    var authService, userService;
    
    /**
     * this trick must be done so that we don't receive
     * Uncaught Error: [$injector:cdep] Circular dependency found
     */
    $timeout(function() {
      authService = $injector.get("authService");
      userService = $injector.get("userService");
    });
    
    return {
      "request": requestInterceptor,
      "responseError": responseError
    };
    
    /**
     * Intercept all outgoing requests to application's API that is authenticated, but isn't /api/v0/auth.
     */
    function requestInterceptor(config) {
      /* Only intercept requests to /api, which aren't to /api/v0/auth */
      if (config.url.indexOf("/api") !== 0 || config.url.indexOf("/api/v0/auth") > -1)
        return config;
      
      /* Use attached access token and complete request if already attached */
      if (config.headers["x-access-token"])
        return config;
      
      /* Attach access token and complete request if not expired */
      if (!userService.accessTokenIsExpired()) {
        config.headers["x-access-token"] = userService.getAccessToken();
        return config;
      }
      
      /* Get new access token using existing refresh token */
      return authService.refresh().then(success, fail);
      
      function success(response) {
        /* Cancel original request if cannot get access token */
        config.headers["x-access-token"] = response.data.accessToken;
        return config;
      }
      
      function fail() {
        return cancelRequest();
      }
      
      function cancelRequest() {
        var canceler = $q.defer();
        config.timeout = canceler.promise;
        canceler.resolve();
        return config;
      }
    }

    /**
     * Intercept all incoming error requests
     */
    function responseError(response) {
      if (response.error === -1)
        response.data.message = "Your request could not be processed.";
      
      return $q.reject(response);
    }
  }
})();
