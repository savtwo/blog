(function() {
  "use strict";

  angular
    .module("app.message")
    .controller("MessageCtrl", MessageCtrl);

  MessageCtrl.$inject = ["$http"];
  /* @ngInject */
  function MessageCtrl($http) {
    var vm = this;
    
    vm.test = test;
    vm.msg = "No message yet.";
    
    function test() {
      $http.get("/api/v0/msg/random").then(function(response) {
        //console.log("test message response |", response);
        vm.msg = response.data.message;
      }, function() {
        //console.log("test message canceled |", response);
        vm.msg = "something went wrong";
      });
    }
  }
})();
