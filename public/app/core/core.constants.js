(function() {
  "use strict";
  
  angular
    .module("app.core")
    .constant("api", api());
    
    function api() {
      var api = "/api/v0";

      return {
        auth: api + "/auth"
      };
    }
})();
