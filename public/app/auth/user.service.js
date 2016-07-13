(function() {
  "use strict";
  
  angular
    .module("app.auth")
    .service("userService", userService);
  
  userService.$inject = ["$window", "jwt_decode"];
  /* @ngInject */
  function userService($window, jwt_decode) {
    var vm = this;

    vm.accessTokenIsExpired = accessTokenIsExpired;
    vm.destroyTokens = destroyTokens;
    vm.getAccessToken = getAccessToken;
    vm.getRefreshToken = getRefreshToken;
    vm.refreshUser = refreshUser;
    vm.setAccessToken = setAccessToken;
    vm.setRefreshToken = setRefreshToken;
    vm.user = undefined;
    
    /**
     * Gets access token and determines if it is expired, or close to expiring.
     * -30000 subtracts 30 seconds, which is more than enough buffer time to make sure the
     * token isn't going to expire mid-transit.
     *
     * @returns {Boolean} True if access token is expired
     */
    function accessTokenIsExpired() {
      var accessToken = vm.getAccessToken();
      
      if (!accessToken)
        return true;
      
      var decoded = jwt_decode(accessToken);

      return Date.now() >= decoded.exp * 1000 - 30000;
    }

    /**
     * Destroy access and refresh tokens from local storage.
     */
    function destroyTokens() {
      vm.user = undefined;
      $window.localStorage.removeItem("accessToken");
      $window.localStorage.removeItem("refreshToken");
    }
    
    /**
     * Retrieve the access token from localstorage
     *
     * @returns {String} JWT access token
     */
    function getAccessToken() {
      return $window.localStorage.getItem("accessToken");
    }
    
    /**
     * Retrieve the access token from localstorage
     *
     * @returns {String} Refresh token
     */
    function getRefreshToken() {
      return $window.localStorage.getItem("refreshToken");
    }
    
    /**
     * Refresh the user object to the decoded JWT access token stored in localStorage.
     *
     * @return {Object} User
     */
    function refreshUser(accessToken) {
      var token = accessToken || vm.getAccessToken();
      
      if (!token)
        return undefined;
      
      return vm.user = jwt_decode(token);
    }

    /**
     * Set the JWT access token and update the user.
     *
     * @param {String} accessToken - JWT Access token.
     * @returns {String} Access token
     */
    function setAccessToken(accessToken) {
      vm.user = jwt_decode(accessToken);
      $window.localStorage.setItem("accessToken", accessToken);
      return accessToken;
    }

    /**
     * Set the opaque refresh token.
     *
     * @param {String} refreshToken - Opaque refresh token.
     * @returns {String} Refresh token
     */
    function setRefreshToken(refreshToken) {
      $window.localStorage.setItem("refreshToken", refreshToken);
      return refreshToken;
    }
  }
})();
