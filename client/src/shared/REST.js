"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    "REST",
    ["$http", "Token", "LoginLogout", function($http, Token, Log) {

      var checkFor401 = function(err, status) {
        if (status === 401) {
          // API call unauthorized because of invalid token
          // Logout
          Log.out();
          return;
        }
        // otherwise delegate error handling to caller
        else throw err;
      };

      var APICall = function(obj) {
        /*
        @param :  obj = {
                    url: <string>
                    method: <string>
                    [data: <string>]
                  }
        */
        return $http({
          method: obj.method,
          url: obj.url,
          headers: {"Authorization": "Bearer " + Token.get()},
          data: obj.data || {}
        })
        .error(checkFor401);
      };

      return {

        deleteUser: function() {
          return APICall({ method: "DELETE", url: "/api/self" });
        },

        getIncomingBookRequests: function() {
          return APICall({
            method: "GET", url: "/api/self/book_requests/incoming"
          });
        },

        getOutgoingBookRequests: function() {
          return APICall({
            method: "GET", url: "/api/self/book_requests/outgoing"
          });
        },

        getBorrowedBooks: function() {
          return APICall({
            method: "GET", url: "/api/self/books_borrowed"
          });
        },

        getLentBooks: function() {
          return APICall({
            method: "GET", url: "/api/self/books_lent"
          });
        },

        getOwnBooks: function() {
          return APICall({
            method: "GET", url: "/api/self/books"
          });
        },

        createCopy: function(data) {
          return APICall({
            method: "POST", url: "/api/books", data: data
          });
        },

        deleteCopy: function(copyid) {
          return APICall({
            method: "DELETE", url: "/api/books/" + copyid
          });
        },

        getAvailableBooks: function() {
          return APICall({
            method: "GET", url: "/api/books/available"
          });
        },

        createBookRequest: function(copyid) {
          return APICall({
            method: "POST", url: "/api/trans/request",
            data: { copyid: copyid }
          });
        },

        cancelBookRequest: function(copyid) {
          return APICall({
            method: "DELETE", url: "/api/trans/request/" + copyid
          });
        },

        checkoutBook: function(copyid, requesterid) {
          return APICall({
            method: "POST",
            url: "/api/trans/checkout",
            data: { copyid: copyid, requesterid: requesterid }
          });
        },

        denyBookRequest: function(copyid, requesterid) {
          return APICall({
            method: "POST",
            url: "/api/trans/deny",
            data: { copyid: copyid, requesterid: requesterid }
          });
        },

        checkinBook: function(copyid) {
          return APICall({
            method: "POST", url: "/api/trans/checkin", data: { copyid: copyid }
          });
        },

        // TODO : Move this function to its own service

        // queryGoogleBooks: function(isbn) {
        //   APICall({
        //     method: "GET",
        //     url: "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn + "&key=AIzaSyCDBfooq1pwrKzZzyUiBTa-cXHA25E63M0"
        //   });
        // }
      };
    }]
  );
};
