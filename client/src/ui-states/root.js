"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.controller("rootController", ["$state", "token", function($state, token) {

    this.init = function() {
      // Try to retrieve access token.
      // If found, proceed to app; otherwise go to "public" state.
      $state.go(token.get() ? "app.find_books" : "public");
    };

    // GO
    this.init();
  }]);
};
