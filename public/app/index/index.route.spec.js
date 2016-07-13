/* eslint no-undef: 0 */

describe("[Routes] index", function() {
  var views = {
    index: "app/index/index.html"
  };

  beforeEach(function() {
    module("app.index");
    module("mh.templates");
    bard.inject("$rootScope", "$state");
  });

  bard.verifyNoOutstandingHttpRequests();

  describe("index", function() {
    it("should map index state to url /", function() {
      expect($state.href("index", {})).to.equal("/");
    });

    it("should map index route to index view template", function() {
      expect($state.get("index").templateUrl).to.equal(views.index);
    });

    it("should have $state.go route to index", function() {
      $state.go("index");
      $rootScope.$apply();
      expect($state.is("index")).to.be.true;
    });
  });
});
