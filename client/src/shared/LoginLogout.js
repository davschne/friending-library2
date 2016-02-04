"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    "LoginLogout",
    ["$http", "$window", "$state", "Token", function($http, $window, $state, Token) {

      return {

        in : function() {
          // hit server login endpoint
          $window.location.href = "/login";
        },

        out : function() {
          // log out on server
          $http({
            method: "POST",
            url: "/logout",
            headers: {"Authorization": "Bearer " + Token.get()}
          });
          // remove access token
          Token.del();
          // return to "public" state
          $state.go("public");
        }
      };
    }]
  );
};
