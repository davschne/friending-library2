var pgpLib = require("pg-promise");

function sql(filepath) {
  return new pgpLib.QueryFile("./sql/" + filepath, {minify: true});
}

var queryProvider = {

  // admin
  setupDatabase: sql("admin/setupDatabase.sql"),

  // user queries
  findOrCreateUser: sql("users/findOrCreateUser.sql"),
  deleteUser: sql("users/deleteUser.sql"),

  // book queries
  createBook: sql("books/createBook.sql"),
  getAvailableBooks: sql("books/getAvailableBooks.sql"),
  getBorrowedBooks: sql("books/getBorrowedBooks.sql"),
  getLentBooks: sql("books/getLentBooks.sql"),
  getOwnBooks: sql("books/getOwnBooks.sql"),

  // copy queries
  createCopy: sql("copies/createCopy.sql"),
  deleteCopy: sql("copies/deleteCopy.sql"),

  // book request queries
  createBookRequest: sql("bookrequests/createBookRequest.sql"),
  deleteBookRequest: sql("bookrequests/deleteBookRequest.sql"),
  getIncomingBookRequests: sql("bookrequests/getIncomingBookRequests.sql"),
  getOutgoingBookRequests: sql("bookrequests/getOutgoingBookRequests.sql"),

  // borrowing queries
  createBorrowing: sql("borrowing/createBorrowing.sql"),
  deleteBorrowing: sql("borrowing/deleteBorrowing.sql")
};

module.exports = queryProvider;
