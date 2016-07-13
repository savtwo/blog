(function() {
  "use strict";
  
  angular
    .module("app.auth")
    .service("authService", authService);
  
  authService.$inject = ["$http", "$q", "$state", "api", "userService"];
  /* @ngInject */
  function authService($http, $q, $state, api, userService) {
    var vm = this;
    
    vm.change = change;
    vm.forgot = forgot;
    vm.login = login;
    vm.logout = logout;
    vm.refresh = refresh;
    vm.register = register;
    vm.resend = resend;
    vm.verify = verify;
    
    /**
     * Send a request to change the account password using the e-mail and password reset token.
     *
     * @param {String} email - E-mail of account.
     * @param {String} token - Password reset token.
     * @param {String} password - Password of account.
     * @returns {$q}
     */
    function change(email, token, password) {
      var data = {
        email: email,
        token: token,
        password: password
      };

      return $http.post(api.auth + "/change", data).then(success, fail);
      
      function success(response) {
        return response;
      }
      
      function fail(response) {
        return $q.reject(response);
      }
    }
    
    /**
     * Send a password reset link to the specified e-mail.
     *
     * @param {String} email - E-mail of account.
     * @returns {$q}
     */
    function forgot(email) {
      var data = {
        email: email
      };
      
      return $http.post(api.auth + "/forgot", data).then(success, fail);
      
      function success(response) {
        return response;
      }
      
      function fail(response) {
        return $q.reject(response);
      }
    }
    
    /**
     * Login to a user account. Retrieve and store the refresh and JWT
     *
     * @param {String} email - E-mail of account.
     * @param {String} password - Password of account.
     * @returns {$q}
     */
    function login(email, password) {
      var data = {
        email: email,
        password: password
      };
      
      return $http.post(api.auth + "/login", data).then(success, fail);
      
      function success(response) {
        /* store tokens in local storage */
        userService.setRefreshToken(response.data.refreshToken);
        userService.setAccessToken(response.data.accessToken);
        
        return response;
      }
      
      function fail(response) {
        return $q.reject(response);
      }
    }
    
    /**
     * Logout of a user account. Delete the refresh and access tokens from the client.
     *
     * @param {String} toState - State that should be transitioned to after logging out.
     * @param {Object} toParams - Parameters that should be passed to the identified transition state.
     * @returns {$q}
     */
    function logout(toState, toParams) {
      var config = {
        headers: {
          "x-refresh-token": userService.getRefreshToken()
        }
      };
      
      return $http.post(api.auth + "/logout", undefined, config).then(success, fail);
      
      function success(response) {
        userService.destroyTokens();
        
        if (toState)
          $state.go(toState, toParams);
        
        return response;
      }
      
      function fail(response) {
        return $q.reject(response);
      }
    }
    
    /**
     * Refresh access token using local refresh token
     *
     * @returns {$q}
     */
    function refresh() {
      var config = {
        headers: {
          "x-refresh-token": userService.getRefreshToken()
        }
      };
      
      return $http.post(api.auth + "/refresh", undefined, config).then(success, fail);
      
      function success(response) {
        userService.setAccessToken(response.data.accessToken);
        
        return response;
      }
      
      function fail(response) {
        /**
         * If the response returned an error, it means the token was invalid anyway so we should clear it.
         * If the response status is -1, ignore the failure since the server may have timed out.
         */
        if (response.status !== -1)
          userService.destroyTokens();
        
        return $q.reject(response);
      }
    }
    
    /**
     * Register a new user account
     *
     * @param {String} email - E-mail of account.
     * @param {String} password - Password of account.
     * @returns {$q}
     */
    function register(email, password) {
      var data = {
        email: email,
        password: password
      };
      
      return $http.post(api.auth + "/register", data).then(success, fail);
      
      function success(response) {
        return response;
      }
      
      function fail(response) {
        return $q.reject(response);
      }
    }
    
    /**
     * Register a new user account
     *
     * @param {String} email - E-mail of account.
     * @returns {$q}
     */
    function resend(email) {
      var data = {
        email: email
      };
      
      return $http.post(api.auth + "/resend", data).then(success, fail);
      
      function success(response) {
        return response;
      }
      
      function fail(response) {
        return $q.reject(response);
      }
    }
    
    /**
     * Verify a user account using an e-mail and token
     *
     * @param {String} email - E-mail of account.
     * @param {String} token - E-mail verification token.
     * @returns {$q}
     */
    function verify(email, token) {
      var data = {
        email: email,
        token: token
      };
      
      return $http.post(api.auth + "/verify", data).then(success, fail);
      
      function success(response) {
        return response;
      }
      
      function fail(response) {
        return $q.reject(response);
      }
    }
  }
})();
