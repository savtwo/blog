/* eslint no-undef: 0 */

describe("[Directives] mhIncludeReplace", function() {
  var compiledElement;
  var element;
  var scope;
  
  beforeEach(function() {
    bard.appModule("core.helpers");
    bard.inject("$compile", "$rootScope", "$templateCache");
  });

  beforeEach(function() {
    $templateCache.put("test.html", "<div id='childDiv'>test</div>");
    element = angular.element(
      "<div>" +
      "<span id='parentDiv' ng-include=\"'test.html'\" mh-include-replace></span>" +
      "</div>"
    );
    scope = $rootScope;
    compiledElement = $compile(element)(scope);
    scope.$digest();
  });

  it("should replace the parent element", function() {
    expect(compiledElement.html()).to.include("childDiv");
    expect(compiledElement.html()).to.not.include("parentDiv");
  });
});
