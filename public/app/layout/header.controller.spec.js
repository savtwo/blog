/* eslint no-undef: 0 */

describe("[Controllers] HeaderCtrl", function() {
  var scope, controller;
  
  beforeEach(function() {
    bard.appModule("app.shell");
    bard.inject("$controller", "$q", "$rootScope");
  });

  beforeEach(function() {
    scope = $rootScope.$new();
    controller = $controller("HeaderCtrl", { $scope: scope });
    $rootScope.$apply();
  });

  bard.verifyNoOutstandingHttpRequests();

  it("should exist", function() {
    expect(controller).to.exist;
  });
});
