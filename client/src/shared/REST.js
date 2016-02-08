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

        createBookRequest: function(copy) {
          return APICall({
            method: "POST", url: "/api/trans/request",
            data: { copyid: copy.copyid }
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
          var requesterid = bookrequest.requester.id;
          return APICall({
            method: "POST",
            url: "/api/trans/deny",
            data: { copyid: copyid, requesterid: requesterid }
          });
        },

        checkoutBook: function(borrowing) {
          var copyid = borrowing.copy.copyid;
          var requesterid = borrowing.borrower.id;
          // var checkoutdate = borrowing.checkoutdate;
          // var duedate = borrowing.duedate;
          return APICall({
            method: "POST",
            url: "/api/trans/checkout",
            data: { copyid: copyid, requesterid: requesterid }
          });
        },

        checkinBook: function(borrowing) {
          var copyid = borrowing.copy.copyid
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
