// utility function to return random elements from testData arrays

exports.rand = function(array) {
  var val = Math.floor(Math.random() * array.length);
  return array[val];
};

// SQL for setup, teardown of tests

exports.insertUser = function(db, user) {
  var SQL = "INSERT INTO Users (uID, display_name) SELECT $1, $2 WHERE NOT EXISTS (SELECT uID FROM Users WHERE uID = $1);";
  return db.run(SQL, [user.uid, user.display_name]);
};

exports.deleteAllUsers = function(db) {
  var SQL = "DELETE FROM Users;";
  return db.run(SQL);
};

exports.insertBook = function(db, book) {
  var SQL = "INSERT INTO Books (ISBN, title, subtitle, authors, categories, publisher, publishedDate, description, pageCount, language, imageLink, imageLinkSmall) SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 WHERE NOT EXISTS (SELECT ISBN FROM Books WHERE ISBN = CAST($1 AS varchar));"
  return db.run(SQL, [
    book.ISBN[13] || book.ISBN[10],
    book.title,
    book.subtitle,
    book.authors,
    book.categories,
    book.publisher,
    book.publishedDate,
    book.description,
    book.pageCount,
    book.language,
    book.imageLinks.thumbnail,
    book.imageLinks.smallThumbnail
  ]);
};

exports.deleteAllBooks = function(db) {
  var SQL = "DELETE FROM Books;";
  return db.run(SQL);
};

exports.insertCopy = function(db, book, owner) {
  var SQL = "INSERT INTO Copies (ISBN, ownerID) VALUES ($1, $2) RETURNING copyid;";
  return db.run(SQL, [book.ISBN[13] || book.ISBN[10], owner.uid])
    .then(function(res) {
      return res;
    });
};

exports.insertBookRequest = function(db, requester, copyid) {
  var SQL = "INSERT INTO BookRequests (requesterid, copyid, request_date) VALUES ($1, $2, CURRENT_TIMESTAMP);";
  return db.run(SQL, [requester.uid, copyid]);
};

exports.insertBorrowing = function(db, borrower, copyid) {
  var SQL = "INSERT INTO Borrowing (borrowerID, copyID, checkout_date) VALUES ($1, $2, CURRENT_TIMESTAMP);";
  return db.run(SQL, [borrower.uid, copyid]);
};

exports.deleteAllBorrowing = function(db) {
  var SQL = "DELETE FROM BORROWING;";
  return db.run(SQL);
};
