(function() {
  "use strict";
  
  angular
    .module("app.core")
    .run(run);
  
  run.$inject = ["routerHelper"];
  /* @ngInject */
  function run(routerHelper) {
    var otherwise = "/";
    
    routerHelper.configureStates(getStates(), otherwise);
  }
  
  function getStates() {
    return [];
  }
})();
