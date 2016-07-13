/**
 * Should be used with ng-include.
 * Replaces the element it's used on with its own children.
 */
(function() {
  "use strict";
  
  angular
    .module("core.helpers")
    .directive("mhIncludeReplace", mhIncludeReplace);
  
  function mhIncludeReplace() {
    return {
      require: "ngInclude",
      restrict: "A",
      link: postLink
    };
    
    function postLink(scope, element) {
      element.replaceWith(element.children());
    }
  }
})();
