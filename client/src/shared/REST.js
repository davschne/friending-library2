"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    "REST",
    ["$q", "$http", "Token", "LoginLogout", function($q, $http, Token, Log) {

      var checkFor401 = function(res) {
        if (res.status === 401) {
          // API call unauthorized because of invalid token
          // Logout
          Log.out();
          return;
        }
        // otherwise delegate error handling to caller
        return $q.reject(res);
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
        .then(function(res) { return res.data; })
        .catch(checkFor401);
      };

      return {

        deleteUser: function() {
          return APICall({ method: "DELETE", url: "/api/self" });
        },

        getAvailableBooks: function() {
          return APICall({
            method: "GET", url: "/api/books/available"
          });
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

        createCopy: function(book) {
          return APICall({
            method: "POST", url: "/api/books", data: book
          });
        },

        deleteCopy: function(copy) {
          return APICall({
            method: "DELETE", url: "/api/books/" + copy.copyid
          });
        },

        createBookRequest: function(bookrequest) {
          return APICall({
            method: "POST", url: "/api/trans/request",
            data: {
              copyid       : bookrequest.copy.copyid,
              request_date : bookrequest.request_date
            }
          });
        },

        cancelBookRequest: function(bookrequest) {
          var copyid = bookrequest.copy.copyid;
          return APICall({
            method: "DELETE", url: "/api/trans/request/" + copyid
          });
        },

        denyBookRequest: function(bookrequest) {
          var copyid = bookrequest.copy.copyid;
          var requesterid = bookrequest.requester.uid;
          return APICall({
            method: "POST",
            url: "/api/trans/deny",
            data: { copyid: copyid, requesterid: requesterid }
          });
        },

        checkoutBook: function(borrowing) {
          return APICall({
            method: "POST",
            url: "/api/trans/checkout",
            data: {
              copyid        : borrowing.copy.copyid,
              requesterid   : borrowing.borrower.uid,
              checkout_date : borrowing.checkout_date,
              // due_date      : borrowing.due_date
            }
          });
        },

        checkinBook: function(borrowing) {
          var copyid = borrowing.copy.copyid
          return APICall({
            method: "POST", url: "/api/trans/checkin", data: { copyid: copyid }
          });
        },
      };
    }]
  );
};
