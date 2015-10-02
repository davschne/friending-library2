BEGIN;

CREATE TABLE Users (
  uID serial PRIMARY KEY,
  displayName varchar,
  access_token varchar
);

CREATE TABLE Friendship (
  uID1 integer REFERENCES Users (uID) ON DELETE CASCADE,
  uID2 integer REFERENCES Users (uID) ON DELETE CASCADE
);

CREATE TABLE Books (
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

CREATE TABLE Authors (
  aID serial PRIMARY KEY,
  aName varchar
);

CREATE TABLE Wrote (
  aID integer REFERENCES Authors ON DELETE CASCADE,
  ISBN integer REFERENCES Books ON DELETE CASCADE
);

CREATE TABLE Copies (
  cID serial PRIMARY KEY,
  ISBN integer REFERENCES Books ON DELETE CASCADE,
  uID integer REFERENCES Users ON DELETE CASCADE
);

CREATE TABLE Borrowing (
  uID integer REFERENCES Users ON DELETE RESTRICT,
  cID integer REFERENCES Copies ON DELETE CASCADE,
  checkoutDate timestamp with time zone
);

CREATE TABLE BookRequests (
  uID integer REFERENCES Users ON DELETE CASCADE,
  cID integer REFERENCES Copies ON DELETE CASCADE,
  requestDate timestamp with time zone
);

COMMIT;
