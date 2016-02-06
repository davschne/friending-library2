"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    "Token",
    ["$cookies", "$location", function($cookies, $location) {

      var token;

      var get = function() {

        if (!token) {

          // if private var undefined, check query string
          token = $location.search().access_token;

          if (token) {

            // if it was in the query string, store it in a cookie
            $cookies.put("friendinglibrary.token", token);
            // and remove it from browser's URL display
            $location.url("/");

          } else {

            // if it wasn't in the query string, check cookie
            token = $cookies.get("friendinglibrary.token");
          }
        }

        // return token, whether defined or not
        return token;
      };

      var del = function() {

        // delete private variable
        token = undefined;

        // delete cookie
        $cookies.remove("friendinglibrary.token");
      };

      return {
        get: get,
        del: del
      };
    }]
  );
};
