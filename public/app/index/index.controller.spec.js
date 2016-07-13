/* eslint no-undef: 0 */

describe("[Controllers] IndexCtrl", function() {
  var controller;
  
  beforeEach(function() {
    bard.appModule("app.index");
    bard.inject("$controller", "$q", "$rootScope");
  });

  beforeEach(function() {
    controller = $controller("IndexCtrl");
    $rootScope.$apply();
  });

  bard.verifyNoOutstandingHttpRequests();

  it("should exist", function() {
    expect(controller).to.exist;
  });
});
