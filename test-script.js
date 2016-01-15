var dbUtil = require('./lib/db-util');

var pg = dbUtil.getInstance('postgres://postgres:@127.0.0.1:5432/friending_library_test');

var testData = require('./lib/test-data');

var user = testData.users[0];
var book = testData.books[0];
var ISBN = book.ISBN[13];
var params = [pg, user.uid, ISBN, book.title, book.subtitle, book.authors, book.categories, book.publisher, book.publishedDate, book.description, book.pageCount, book.language, book.imageLinks.thumbnail, book.imageLinks.smallThumbnail];
