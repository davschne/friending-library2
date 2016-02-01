"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    "login-logout",
    ["$http", "$window", "$state", "token", function($http, $window, $state, token) {

      var login = function() {
        // hit server login endpoint
        $window.location.href = "/login";
      };

      var logout = function() {
        // log out on server
        $http({
          method: "POST",
          url: "/logout",
          headers: {"Authorization": "Bearer " + token.get()}
        });
        // remove access token
        token.del();
        // return to "public" state
        $state.go("public");
      };

      return {
        in : login,
        out: logout
      };
    }]
  );
};
