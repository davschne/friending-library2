// utility function to return random elements from testData arrays

exports.rand = function(array) {
  var val = Math.floor(Math.random() * array.length);
  return array[val];
};

exports.formatBook = function(book, additions) {
  var out = Object.create(null);
  out.isbn           = book.isbn;
  out.title          = book.title;
  out.subtitle       = book.subtitle;
  out.authors        = book.authors;
  out.categories     = book.categories;
  out.publisher      = book.publisher;
  out.publisheddate  = book.publisheddate;
  out.description    = book.description;
  out.pagecount      = book.pagecount;
  out.language       = book.language;
  out.imagelink      = book.imagelink;
  out.volumelink     = book.volumelink;
  for (field in additions) {
    if (additions.hasOwnProperty(field) && typeof field !== "function") {
      out[field] = additions[field];
    }
  }
  return out;
};

// SQL for setup, teardown of tests

exports.insertUser = function(db, user) {
  var SQL = "INSERT INTO Users (uid, display_name) SELECT $1, $2 WHERE NOT EXISTS (SELECT uid FROM Users WHERE uid = $1);";
  return db.query(SQL, [user.uid, user.display_name]);
};

exports.deleteAllUsers = function(db) {
  var SQL = "DELETE FROM Users;";
  return db.query(SQL);
};

exports.insertBook = function(db, book) {
  var SQL = "INSERT INTO Books (isbn, title, subtitle, authors, categories, publisher, publisheddate, description, pagecount, language, imagelink, volumelink) SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 WHERE NOT EXISTS (SELECT isbn FROM Books WHERE isbn = CAST($1 AS varchar));"
  return db.query(SQL, [
    book.isbn,
    book.title,
    book.subtitle,
    book.authors,
    book.categories,
    book.publisher,
    book.publisheddate,
    book.description,
    book.pagecount,
    book.language,
    book.imagelink,
    book.volumelink
  ]);
};

exports.deleteAllBooks = function(db) {
  var SQL = "DELETE FROM Books;";
  return db.query(SQL);
};

exports.insertCopy = function(db, book, owner) {
  var SQL = "INSERT INTO Copies (isbn, ownerid) VALUES ($1, $2) RETURNING copyid;";
  return db.query(SQL, [book.isbn, owner.uid])
    .then(function(res) {
      return res;
    });
};

exports.insertBookRequest = function(db, requester, copyid, request_date) {
  var SQL = "INSERT INTO BookRequests (requesterid, copyid, request_date) VALUES ($1, $2, $3);";
  return db.query(SQL, [requester.uid, copyid, request_date]);
};

exports.insertBorrowing = function(db, borrower, copyid, checkout_date) {
  var SQL = "INSERT INTO Borrowing (borrowerid, copyid, checkout_date) VALUES ($1, $2, $3);";
  return db.query(SQL, [borrower.uid, copyid, checkout_date]);
};

exports.deleteAllBorrowing = function(db) {
  var SQL = "DELETE FROM BORROWING;";
  return db.query(SQL);
};
