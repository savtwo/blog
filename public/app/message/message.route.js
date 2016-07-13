(function() {
  "use strict";
  
  angular
    .module("app.message")
    .run(run);
  
  run.$inject = ["routerHelper"];
  /* @ngInject */
  function run(routerHelper) {
    routerHelper.configureStates(getStates());
  }
  
  function getStates() {
    return [
      {
        state: "message",
        config: {
          url: "/message",
          templateUrl: "app/message/message.html",
          controller: "MessageCtrl",
          controllerAs: "mc",
          data: {
            requiresAuth: true
          }
        }
      }
    ];
  }
})();
