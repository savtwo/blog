(function() {
"use strict";

  angular
    .module("app.auth")
    .controller("LoginModalCtrl", LoginModalCtrl);

  LoginModalCtrl.$inject = ["$q", "$state", "$uibModalInstance", "authService", "params"];
  /* @ngInject */
  function LoginModalCtrl($q, $state, $uibModalInstance, authService, params) {
    var vm = this;
    
    vm.forgot = forgot;
    vm.forgotAlert = {
      message: undefined,
      type: undefined
    };
    vm.login = login;
    vm.loginAlert = {
      message: params.message,
      type: params.messageType
    };
    vm.register = register;
    vm.registerAlert = {
      message: undefined,
      type: undefined
    };
    vm.modalInstance = $uibModalInstance;
    
    /**
     * Send a password reset link to the e-mail.
     *
     * @param {String} email - E-mail to send e-mail to.
     * @returns {$q}
     */
    function forgot(email) {
      return authService.forgot(email).then(success, fail);
      
      function success(response) {
        vm.forgotAlert.message = "Password reset link has been sent to the e-mail.";
        vm.forgotAlert.type = "bg-success";
        return response;
      }
      
      function fail(response) {
        vm.forgotAlert.type = "bg-danger";
        
        switch (response.status) {
          case 401:
            vm.forgotAlert.message = "E-mail doesn't exist.";
            break;
          default:
            vm.forgotAlert.message = "Something went wrong, please try again.";
        }
        
        return $q.reject(response);
      }
    }
    
    /**
     * Login method and view handler
     *
     * @param {String} email - E-mail of account.
     * @param {String} password - Password of account.
     * @returns {$q}
     */
    function login(email, password) {
      return authService.login(email, password).then(success, fail);
      
      function success(response) {
        $uibModalInstance.close();
        return response;
      }
      
      function fail(response) {
        vm.loginAlert.type = "bg-danger";
        
        switch (response.status) {
          case 401:
            vm.loginAlert.message = "E-mail or password is invalid, please try again.";
            break;
          case 403:
            $uibModalInstance.dismiss();
            $state.go("verify", { email: email });
            break;
          default:
            vm.loginAlert.message = "Something went wrong, please try again.";
        }
        
        return $q.reject(response);
      }
    }
    
    /**
     * Register method and view handler
     *
     * @param {String} email - E-mail of account.
     * @param {String} password - Password of account.
     * @returns {$q}
     */
    function register(email, password) {
      return authService.register(email, password).then(success, fail);
      
      function success(response) {
        vm.registerAlert.message = "Account has been registered. Please check your e-mail for a verification link.";
        vm.registerAlert.type = "bg-success";
        return response;
      }
      
      function fail(response) {
        vm.registerAlert.type = "bg-danger";
        
        switch (response.status) {
          case 401:
            vm.registerAlert.message = "Must enter a valid e-mail and password.";
            break;
          case 409:
            vm.registerAlert.message = "E-mail already exists.";
            break;
          default:
            vm.registerAlert.message = "Something went wrong, please try again.";
        }
        
        return $q.reject(response);
      }
    }
  }
})();
