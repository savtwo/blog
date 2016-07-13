(function() {
  "use strict";
  
  angular
    .module("app.auth")
    .config(config);
  
  config.$inject = ["$httpProvider"];
  /* @ngInject */
  function config($httpProvider) {
    $httpProvider.interceptors.push("tokenInterceptor");
  }
})();
