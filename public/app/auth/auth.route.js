(function() {
  "use strict";
  
  angular
    .module("app.auth")
    .run(run);
  
  run.$inject = ["routerHelper"];
  /* @ngInject */
  function run(routerHelper) {
    routerHelper.configureStates(getStates());
  }
  
  function getStates() {
    return [
      { /* See auth.run.js for /login state */
        state: "login",
        config: {
          url: "/login",
          params: {
            message: undefined,
            messageType: "bg-danger",
            redirectState: "message"
          },
          data: {
            authModal: true
          }
        }
      },
      {
        state: "reset",
        config: {
          url: "/reset?token&email",
          templateUrl: "app/auth/reset.html",
          controller: "ResetCtrl",
          controllerAs: "rc"
        }
      },
      {
        state: "verify",
        config: {
          url: "/verify?token&email",
          templateUrl: "app/auth/verify.html",
          controller: "VerifyCtrl",
          controllerAs: "vc",
          resolve: { /* @ngInject */
            verification: function(authService, $q, $state, $stateParams, $timeout) {
              var email = $stateParams.email;
              var token = $stateParams.token;

              if (!email || !token)
                return {
                  message: "Please verify your account. Check your e-mail for a link, or resend an e-mail below."
                };
              
              return authService.verify(email, token).then(success, fail);

              function success(response) {
                /**
                 * $state.go will not work here without $timeout, as it needs to occur on next $digest cycle.
                 */
                $timeout(function() {
                  $state.go("login", {
                    message: "Your account has been verified. Login to continue.",
                    messageType: "bg-success"
                  });
                });
                return response;
              }

              function fail() {
                /**
                 * Do not return a $q.reject since that will cancel the state change. Instead, return
                 * an object containing a message for the controller.
                 */
                return {
                  message: "Provided token was invalid. Check your e-mail for a link, or resend an e-mail below."
                };
              }
            }
          }
        }
      }
    ];
  }
})();
