"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.controller(
    "rootController", ["$state", "Token", function($state, Token) {

      this.init = function() {
        // Try to retrieve access token.
        // If found, proceed to app; otherwise go to "public" state.
        $state.go(Token.get() ? "app.find_books" : "public");
      };

      // GO
      this.init();
    }]
  );
};
