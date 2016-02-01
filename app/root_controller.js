'use strict';

module.exports = function(friendingLibrary) {

  friendingLibrary.controller('rootController', ['$state', 'authService', function($state, auth) {

    this.init = function() {
      // Try to retrieve access token.
      // If found, proceed to app; otherwise go to "public" state.
      $state.go(auth.getToken() ? "app.find_books" : "public");
    };

    // GO
    this.init();
  }]);
};
