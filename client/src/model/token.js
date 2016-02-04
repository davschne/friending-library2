"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    "token",
    ["$cookies", "$location", function($cookies, $location) {

      var token;

      var get = function() {

        if (!token) {

          // if private var undefined, check query string
          token = $location.search().access_token;

          if (token) {

            // if it was in the query string, store it in a cookie
            $cookies.put("friending_library_access_token", token);

          } else {

            // if it wasn't in the query string, check cookie
            token = $cookies.get("friending_library_access_token");
          }
        }

        // return token, whether defined or not
        return token;
      };

      var del = function() {

        // delete private variable
        token = undefined;

        // delete cookie
        $cookies.remove("friending_library_access_token");
      };

      return {
        get: get,
        del: del
      };
    }]
  );
};
