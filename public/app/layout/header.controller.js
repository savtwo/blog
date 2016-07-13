(function() {
"use strict";

  angular
    .module("app.shell")
    .controller("HeaderCtrl", HeaderCtrl);

  HeaderCtrl.$inject = ["$scope", "authService", "userService"];
  /* @ngInject */
  function HeaderCtrl($scope, authService, userService) {
    var vm = this;
    
    vm.logout = logout;
    vm.user = userService.user;
    
    $scope.$watch(function() {
      return userService.user;
    }, function(newVal) {
      vm.user = newVal;
    });
    
    function logout() {
      return authService.logout("index");
    }
  }
})();
