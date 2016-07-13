/* global jwt_decode:false */

(function() {
  "use strict";
  
  angular
    .module("app.auth")
    .constant("jwt_decode", jwt_decode);
})();
