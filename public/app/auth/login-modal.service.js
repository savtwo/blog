(function() {
  "use strict";
  
  angular
    .module("app.auth")
    .service("loginModalService", loginModalService);
  
  loginModalService.$inject = ["$rootScope", "$uibModal"];
  /* @ngInject */
  function loginModalService($rootScope, $uibModal) {
    var vm = this;
    
    vm.modal = undefined;
    vm.openModal = openModal;
    
    /**
     * Opens the login/registration modal window.
     *
     * @param {Object} params - Parameters to send back to the resolved route.
     * @returns Instance of the ui-bootstrap modal.
     */
    function openModal(params) {
      vm.modal = $uibModal.open({
        templateUrl: "/app/auth/login-modal.html",
        controller: "LoginModalCtrl",
        controllerAs: "lmc",
        resolve: {
          params: function() {
            return params;
          }
        }
      });
      
      vm.modal.result.finally(function() {
        vm.modal = undefined;
      });
      
      return vm.modal;
    }
  }
})();
