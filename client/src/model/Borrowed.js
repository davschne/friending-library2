"use strict";

module.exports = function(friendingLibrary, DataModel) {

  friendingLibrary.factory(
    "Borrowed", ["REST", function(rest) {

      var createBorrowingObject = function(r) {
        return {
          copy: {
            copyid: r.copyid,
            owner : {
              id           : r.ownerid,
              display_name : r.owner_display_name
            },
            book : {
              ISBN          : r.ISBN,
              title         : r.title,
              subtitle      : r.subtitle,
              authors       : r.authors,
              categories    : r.categories,
              publisher     : r.publisher,
              publisheddate : r.publisheddate,
              description   : r.description,
              pagecount     : r.pagecount,
              language      : r.language,
              imagelink     : r.imagelink,
              imagelinksmall: r.imagelinksmall
            }
          // not needed - user is borrower
          // *****************************
          // borrower: {
          //   id           : r.id,
          //   display_name : r.display_name
          // },
          },
          checkout_date : r.checkout_date,
          // due_date      : r.due_date
        };
      };

      return DataModel(rest.getBorrowedBooks, createBorrowingObject);

      // var borrowing = [];

      // var refresh = function() {
      //   rest.getBorrowedBooks(function(records) {
      //     // create copy objects
      //     records.map(createBorrowingObject);
      //     borrowing = records;
      //   });
      // };

      // // utility to find the index of a copy in the array by its copyid
      // // could speed this up to lg N if the array is sorted by copyid

      // // var findIndexByID = function(copyid) {
      // //   for (var i = 0; i < borrowing.length; i++) {
      // //     if (borrowing[i].copyid === copyid) return i;
      // //   }
      // //   return null;
      // // };

      // // on loading the service, populate the borrowing array
      // refresh();

      // return {
      //   getAll: function() {
      //     refresh();
      //     return borrowing;
      //   },
      //   add: function(copy) { borrowing.push(copy); },
      //   del: function(copy) { borrowing.splice(indexOf(copy), 1); }
      // };
    }]
  );
};
