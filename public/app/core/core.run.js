(function() {
  "use strict";
  
  angular
    .module("app.core")
    .run(run);
  
  run.$inject = ["$http"];
  /* @ngInject */
  function run($http) {
    $http.defaults.cache = false;
  }
})();
