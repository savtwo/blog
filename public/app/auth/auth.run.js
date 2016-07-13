(function() {
  "use strict";
  
  angular
    .module("app.auth")
    .run(run);
  
  run.$inject = ["$q", "$rootScope", "$state", "authService", "loginModalService", "userService"];
  /* @ngInject */
  function run($q, $rootScope, $state, authService, loginModalService, userService) {
    refreshAccessToken();
    
    /**
     * Handle $state changes for the login/registration modal window.
     * We want /login to be a valid routable page, but want it to appear as a modal over the current route.
     * In order to do this, we have to manually intercept the $stateChangeStart event and open the modal from the authService.
     **/
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState) {
      /**
       * Check if changed state is the authentication modal.
       */
      if (!toState.data || !toState.data.authModal)
        return;
      
      /**
       * If entering app for first time, load background state for auth modal.
       */
      if (fromState.name === "")
        $state.go("index");
        
      /**
       * Instead of changing state, load login modal window.
       */
      if (toState.name === "login") {
        event.preventDefault();
        
        loginModalService.openModal(toParams).result.then(function() {
          $state.go(toParams.redirectState);
          return;
        }, function() {
          return;
        });
      }
    });
      
    /**
     * Handle $state changes for any authenication-required routes.
     */
    $rootScope.$on("$stateChangeStart", function(event, toState) {
      /**
       * Check if the changed state is one which requires authentication first.
       */
      if (!toState.data || !toState.data.requiresAuth)
        return;
      
      /**
       * Refresh token does not exist on client. Do not proceed to route, and redirect to login route instead.
       */
      if (!userService.getRefreshToken()) {
        event.preventDefault();
        return goToLogin();
      }
      
      /**
       * Access token is not expired. Simply refresh the user in memory and continue to route.
       */
      if (!userService.accessTokenIsExpired)
        return userService.refreshUser();
      
      /**
       * Refresh token exists, but access token is expired. Get new access token. If request fails, route to login.
       */
      refreshAccessToken().then(null, goToLogin);
      
      /**
       * Token refresh failed, redirect to /login.
       */
      function goToLogin() {
        $state.go("login", { message: "Please login.", messageType: "bg-danger", redirectState: toState.name });
      }
    });
    
    /**
     * Refresh access token if refresh token exists and is valid
     *
     * @returns {$q}
     */
    function refreshAccessToken() {
      /**
       * Refresh token doesn't exist.
       */
      if (!userService.getRefreshToken())
        return $q.reject({});
      
      /**
       * User is logged in and access token isn't expired. Refresh the user state.
       */
      if (!userService.accessTokenIsExpired()) {
        userService.refreshUser();
        return $q.resolve({});
      }
      
      /**
       * Access token is expired or does not exist. Refresh the access token.
       */
      return authService.refresh().then(success, fail);
      
      function success(response) {
        return response;
      }
      
      function fail(response) {
        return $q.reject(response);
      }
    }
  }
})();
