(function() {
  "use strict";
  
  angular
    .module("app.index")
    .run(run);
  
  run.$inject = ["routerHelper"];
  /* @ngInject */
  function run(routerHelper) {
    routerHelper.configureStates(getStates());
  }
  
  function getStates() {
    return [
      {
        state: "index",
        config: {
          url: "/",
          templateUrl: "app/index/index.html",
          controller: "IndexCtrl",
          controllerAs: "ic"
        }
      }
    ];
  }
})();
