/* eslint no-undef: 0 */

describe("[Services] loginModalService", function() {
  var mockModal = mockData.getMockModal();
  
  beforeEach(function() {
    bard.appModule("app.auth");
    bard.inject("$q", "$rootScope", "$uibModal", "loginModalService");
  });

  bard.verifyNoOutstandingHttpRequests();

  it("should exist", function() {
    expect(loginModalService).to.exist;
  });
  
  describe("openModal", function() {
    it("should assign the service modal and open it", function() {
      sandbox.stub($uibModal, "open").returns(mockModal);
      loginModalService.openModal();
      expect($uibModal.open).to.have.been.called;
      expect(loginModalService.modal).to.eql(mockModal);
    });
    
    it("should return the modal", function() {
      sandbox.stub($uibModal, "open").returns(mockModal);
      expect(loginModalService.openModal()).to.eql(mockModal);
    });
  });
});
