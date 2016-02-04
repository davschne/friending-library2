"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    "Transact",
    ["AvailableBooks", "OutgoingBookRequests", "Borrowing",
      "OwnBooks",      "IncomingBookRequests", "Lending",
      function(
        AvailableBooks, OutgoingBookRequests, Borrowing,
        OwnBooks,       IncomingBookRequests, Lending
      ) {

        return {

          requestBook: function(copy) {
            // add (a bookrequest object) to OutgoingBookRequests
            OutgoingBookRequests.add({
              copy: copy,
              requestDate: new Date();
            });
            // remove from AvailableBooks
            AvailableBooks.del(copy.copyid);
          },

          cancelBookRequest: function(bookrequest) {
            // add to AvailableBooks
            AvailableBooks.add(bookrequest.copy);
            // remove from OutgoingBookRequests
            OutgoingBookRequests.del(bookrequest);
          },

          createCopy: function(data) {
            // add to OwnBooks
            // this method makes an HTTP call to get a copyid
            OwnBooks.create(data);
          },

          deleteCopy: function(copy) {
            // remove from OwnBooks
            OwnBooks.del(copy.copyid);
          },

          denyBookRequest: function(bookrequest) {
            // add to OwnBooks
            OwnBooks.add(copy);
            // remove from IncomingBookRequests
            IncomingBookRequests.del(bookrequest);
          },

          checkoutBook: function(bookrequest) {
            // add to Lending
            Lending.add(bookrequest);
            // remove from IncomingBookRequests
            IncomingBookRequests.del(bookrequest);
          },

          checkinBook: function(borrowing) {
            // add to OwnBooks
            OwnBooks.add(borrowing.copy);
            // remove from Lending
            Lending.del(borrowing);
          }
        };
      }
    ]
  );
};
