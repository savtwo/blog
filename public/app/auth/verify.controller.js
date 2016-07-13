(function() {
  "use strict";

  angular
    .module("app.auth")
    .controller("VerifyCtrl", VerifyCtrl);

  VerifyCtrl.$inject = ["$q", "$stateParams", "authService", "verification"];
  /* @ngInject */
  function VerifyCtrl($q, $stateParams, authService, verification) {
    var vm = this;

    vm.alert = {
      message: verification.message,
      type: "bg-danger"
    };
    vm.email = $stateParams.email;
    vm.resend = resend;
    
    /**
     * Resend the e-mail verification token
     *
     * @returns {$q}
     */
    function resend() {
      return authService.resend(vm.email).then(success, fail);
      
      function success(response) {
        vm.alert.message = "Please check your e-mail for a verification link.";
        vm.alert.type = "bg-success";
        return response;
      }
      
      function fail(response) {
        vm.alert.type = "bg-danger";
        
        switch (response.status) {
          case 401:
            vm.alert.message = "E-mail invalid or does not exist.";
            break;
          default:
            vm.alert.message = "Something went wrong when trying to resend the e-mail.";
        }
        
        return $q.reject(response);
      }
    }
  }
})();
