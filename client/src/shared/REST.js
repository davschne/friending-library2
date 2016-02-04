"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    "REST",
    ["$http", "Token", "LoginLogout", function($http, Token, Log) {

      function APICall(obj, callback) {
        /*
        @param :  obj = {
                    url: <string>
                    method: <string>
                    [data: <string>]
                  }
        @param :  callback <function>
        */
        $http({
          method: obj.method,
          url: obj.url,
          headers: {"Authorization": "Bearer " + Token.get()},
          data: obj.data || {}
        })
        .success(function(data, status, headers, config) {
          callback(null, data);
        })
        .error(function(data, status, headers, config) {
          handle(status, callback);
        });
      }

      function handle(status, callback) {
        switch (status) {
          // API call unauthorized because of invalid token
          case 401:
            Log.out();
            break;
          default:
            callback({ status: status }, null);
        }
      }

      return {

        deleteUser: function(callback) {
          APICall({ method: "DELETE", url: "/api/self" }, callback);
        },

        getIncomingBookRequests: function(callback) {
          APICall({
            method: "GET", url: "/api/self/book_requests/incoming"
          }, callback);
        },

        getOutgoingBookRequests: function(callback) {
          APICall({
            method: "GET", url: "/api/self/book_requests/outgoing"
          }, callback);
        },

        getBorrowedBooks: function(callback) {
          APICall({
            method: "GET", url: "/api/self/books_borrowed"
          }, callback);
        },

        getLentBooks: function(callback) {
          APICall({
            method: "GET", url: "/api/self/books_lent"
          }, callback);
        },

        getOwnBooks: function(callback) {
          APICall({
            method: "GET", url: "/api/self/books"
          }, callback);
        },

        createCopy: function(data, callback) {
          APICall({
            method: "POST", url: "/api/books", data: data
          }, callback);
        },

        deleteCopy: function(copyid, callback) {
          APICall({
            method: "DELETE", url: "/api/books/" + copyid
          }, callback);
        },

        getAvailableBooks: function(callback) {
          APICall({
            method: "GET", url: "/api/books/available"
          }, callback);
        },

        createBookRequest: function(copyid, callback) {
          APICall({
            method: "POST", url: "/api/trans/request",
            data: { copyid: copyid }
          }, callback);
        },

        cancelBookRequest: function(copyid, callback) {
          APICall({
            method: "DELETE", url: "/api/trans/request/" + copyid
          }, callback);
        },

        checkoutBook: function(copyid, requesterid, callback) {
          APICall({
            method: "POST",
            url: "/api/trans/checkout",
            data: { copyid: copyid, requesterid: requesterid }
          }, callback);
        },

        denyBookRequest: function(copyid, requesterid, callback) {
          APICall({
            method: "POST",
            url: "/api/trans/deny",
            data: { copyid: copyid, requesterid: requesterid }
          }, callback);
        },

        checkinBook: function(copyid, callback) {
          APICall({
            method: "POST", url: "/api/trans/checkin", data: { copyid: copyid }
          }, callback);
        },

        queryGoogleBooks: function(isbn, callback) {
          APICall({
            method: "GET",
            url: "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn + "&key=AIzaSyCDBfooq1pwrKzZzyUiBTa-cXHA25E63M0"
          }, callback);
        }
      };
    }]
  );
};
