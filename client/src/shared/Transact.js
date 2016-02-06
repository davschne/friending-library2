// TODO : on errors from REST calls, display some sort of error message

"use strict";

module.exports = function(friendingLibrary) {

  friendingLibrary.factory(
    "Transact",
    ["AvailableBooks", "OutgoingBookRequests", "OwnBooks", "IncomingBookRequests", "Lent", "REST",
      function(
        AvailableBooks, OutgoingBookRequests, OwnBooks, IncomingBookRequests, Lent, rest
      ) {

        return {

          requestBook: function(copy) {
            // add (a bookrequest object) to OutgoingBookRequests
            var bookrequest = {
              copy         : copy,
              request_date : new Date()
            };
            OutgoingBookRequests.add(bookrequest);
            // remove from AvailableBooks
            AvailableBooks.del(copy);
            // API call
            rest.createBookRequest(copy)
            .catch(function(res) {
              // if error, roll back local operation
              AvailableBooks.add(copy);
              OutgoingBookRequests.del(bookrequest);
            });
          },

          cancelBookRequest: function(bookrequest) {
            // add to AvailableBooks
            AvailableBooks.add(bookrequest.copy);
            // remove from OutgoingBookRequests
            OutgoingBookRequests.del(bookrequest);
            // API call
            rest.cancelBookRequest(bookrequest.copy.copyid)
            .catch(function(res) {
              // roll back
              OutgoingBookRequests.add(bookrequest);
              AvailableBooks.del(bookrequest.copy);
            });
          },


          // TODO :

          createCopy: function(data) {
            // add to OwnBooks
            // this method makes an HTTP call to get a copyid
            // OwnBooks.create(data);
          },

          deleteCopy: function(copy) {
            // remove from OwnBooks
            OwnBooks.del(copy);
            // API call
            rest.deleteCopy(copy)
            .catch(function(res) {
              // roll back
              OwnBooks.add(copy);
            });
          },

          denyBookRequest: function(bookrequest) {
            // add to OwnBooks
            OwnBooks.add(bookrequest.copy);
            // remove from IncomingBookRequests
            IncomingBookRequests.del(bookrequest);
            // API call
            rest.denyBookRequest(bookrequest)
            .catch(function(res) {
              // roll back
              IncomingBookRequests.add(bookrequest);
              OwnBooks.del(bookrequest.copy);
            });
          },

          checkoutBook: function(bookrequest) {
            var borrowing = {
              copy          : bookrequest.copy,
              borrower      : bookrequest.requester,
              checkout_date : new Date(),
              // TO BE IMPLEMENTED
              // due_date      : due_date
            };
            // add to Lent
            Lent.add(borrowing);
            // remove from IncomingBookRequests
            IncomingBookRequests.del(bookrequest);
            // API call
            rest.checkoutBook(borrowing)
            .catch(function(res) {
              // roll back
              IncomingBookRequests.add(bookrequest);
              Lent.del(borrowing);
            });
          },

          checkinBook: function(borrowing) {
            // add to OwnBooks
            OwnBooks.add(borrowing.copy);
            // remove from Lent
            Lent.del(borrowing);
            // API call
            rest.checkinBook(borrowing)
            .catch(function(res) {
              // roll back
              Lent.add(borrowing);
              OwnBooks.del(borrowing.copy);
            });
          }
        };
      }
    ]
  );
};
