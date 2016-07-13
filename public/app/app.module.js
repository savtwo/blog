(function() {
	"use strict";
  
  angular
    .module("app", [
      /* Shared modules */
      "app.core",
      
      /* Feature areas */
      "app.auth",
      "app.index",
      "app.message",
      "app.shell"
      
      /* 3rd-party modules */
  ]);
})();
