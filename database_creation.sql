BEGIN;

CREATE TABLE User(
  uID serial PRIMARY KEY,
  displayName varchar,
  access_token varchar
);

CREATE TABLE Friend(
  uID1 integer REFERENCES User (uID),
  uID2 integer REFERENCES User (uID)
);

CREATE TABLE Book(
  ISBN integer PRIMARY KEY,
  title varchar,
  subtitle varchar,
  publisher varchar,
  publishedDate integer,
  description varchar,
  pageCount integer,
  language varchar,
  imageLink varchar
);

CREATE TABLE Author(
  aID serial PRIMARY KEY,
  aName varchar
);

CREATE TABLE Wrote(
  aID integer REFERENCES Author,
  ISBN integer REFERENCES Book
);

CREATE TABLE Copy(
  cID serial PRIMARY KEY,
  ISBN integer REFERENCES Book,
  uID integer REFERENCES User
);

CREATE TABLE Borrowing(
  uID integer REFERENCES User,
  cID integer REFERENCES Copy,
  -- checkoutDate
);

CREATE TABLE BookRequest(
  uID integer REFERENCES User,
  cID integer REFERENCES Copy,
  -- date
);

COMMIT;
