/* eslint no-undef: 0, no-unused-vars: 0 */

var mockData = (function() {
  return {
    getMockAccessToken: getMockAccessToken,
    getMockMessageParams: getMockMessageParams,
    getMockModal: getMockModal,
    getMockModalInstance: getMockModalInstance,
    getMockVerification: getMockVerification
  };

  /**
   * Expiration: 1467906638 (1467906638000 in unix ms)
   */
  function getMockAccessToken() {
    return {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1NzU4YTdmNjAzMGY3MjY4MTIzZjcyOWIiLCJlbWFpbCI6Im1vb3NlaGF3a0BnbWFpbC5jb20iLCJpYXQiOjE0Njc5MDYwOTgsImV4cCI6MTQ2NzkwNjYzOH0.tSHBCt7Izc3WxF36Lg2NCWnEOgX790wLnHgb0zYMvpo",
      decoded: {
        "_id": "5758a7f6030f7268123f729b",
        "email": "moosehawk@gmail.com",
        "iat": 1467906098,
        "exp": 1467906638
      }
    };
  }
  
  function getMockMessageParams() {
    return {
      message: "mock message",
      messageType: "bg-color"
    };
  }
  
  function getMockModal() {
    return {
      result: {
          then: function(confirmCallback, cancelCallback) {
            this.confirmCallBack = confirmCallback;
            this.cancelCallback = cancelCallback;
            return this;
          },
          catch: function(cancelCallback) {
            this.cancelCallback = cancelCallback;
            return this;
          },
          finally: function(finallyCallback) {
            this.finallyCallback = finallyCallback;
            return this;
          }
        },
        close: function(item) {
          this.result.confirmCallBack(item);
        },
        dismiss: function(item) {
          this.result.cancelCallback(item);
        },
        finally: function() {
          this.result.finallyCallback();
        }
    };
  }
  
  function getMockModalInstance() {
    return {
      close: function() {},
      dismiss: function() {}
    };
  }

  function getMockVerification() {
    return {
      "message": "You are not verified."
    };
  }
})();
