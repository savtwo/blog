(function() {
  "use strict";

  angular
    .module("app.auth")
    .controller("ResetCtrl", ResetCtrl);

  ResetCtrl.$inject = ["$q", "$state", "$stateParams", "authService"];
  /* @ngInject */
  function ResetCtrl($q, $state, $stateParams, authService) {
    var vm = this;

    vm.alert = {
      message: undefined,
      type: undefined
    };
    vm.change = change;
    
    /**
     * Submit a password change request
     *
     * @param {String} password - New password
     * @returns {$q}
     */
    function change(password) {
      return authService.change($stateParams.email, $stateParams.token, password).then(success, fail);
      
      function success(response) {
        $state.go("login", { message: "Password was changed. Please login.", messageType: "bg-success" });
        return response;
      }
      
      function fail(response) {
        vm.alert.type = "bg-danger";
        
        switch (response.status) {
          case 401:
            vm.alert.message = "E-mail or reset token was invalid.";
            break;
          default:
            vm.alert.message = "Something went wrong when trying to change your password.";
        }
        
        return $q.reject(response);
      }
    }
  }
})();
