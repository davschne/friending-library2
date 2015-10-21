BEGIN;

CREATE TABLE Users (
  uID serial,
  displayName varchar,
  givenName varchar,
  surname varchar,
  PRIMARY KEY pk (uID)
);

CREATE INDEX UserNames ON Users (surname, givenName); -- index for user searches

CREATE TABLE Friendship (
  uID1 integer REFERENCES Users (uID) ON DELETE CASCADE,
  uID2 integer REFERENCES Users (uID) ON DELETE CASCADE,
  PRIMARY KEY pk (uID1, uID2)
);

CREATE TABLE Books (
  ISBN integer,
  title varchar,
  subtitle varchar,
  publisher varchar,
  publishedDate integer,
  description varchar,
  pageCount integer,
  language varchar,
  imageLink varchar,
  PRIMARY KEY pk (ISBN)
);

-- create a materialized view to hold denormalized book data?
-- where would this view be used? where wouldn't it be used?
-- if multiple authors, combine in string as concatenated list?
-- possible to index a materialized view?
-- CREATE MATERIALIZED VIEW BookView AS
--   SELECT *
--   FROM (Authors JOIN Wrote USING(aID))
--     JOIN Books USING(ISBN);

CREATE TABLE Authors (
  aID serial,
  surname varchar,
  givenName varchar,
  PRIMARY KEY pk (aID)
);

CREATE INDEX AuthorNames ON Authors (surname, givenName); -- index for searches by author name

CREATE TABLE Wrote (
  aID integer REFERENCES Authors ON DELETE CASCADE,
  ISBN integer REFERENCES Books ON DELETE CASCADE,
  PRIMARY KEY pk (aID, ISBN)
);

CREATE TABLE Copies (
  cID serial,
  ISBN integer REFERENCES Books ON DELETE CASCADE,
  uIDOwner integer REFERENCES Users ON DELETE CASCADE,
  PRIMARY KEY pk (uIDOwner, ISBN, cID)
);

CREATE TABLE Borrowing (
  uIDBorrower integer REFERENCES Users ON DELETE RESTRICT,
  cID integer REFERENCES Copies ON DELETE CASCADE,
  checkoutDate TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY pk (uID, cID)
);

CREATE TABLE BookRequests (
  uIDRequester integer REFERENCES Users ON DELETE CASCADE,
  cID integer REFERENCES Copies ON DELETE CASCADE,
  requestDate TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY pk (uIDRequester, cID) -- optimized for requester's view
  -- optimize
);

CREATE TABLE FriendRequests (
  uIDRequester integer REFERENCES Users ON DELETE CASCADE,
  uIDInvitee integer REFERENCES Users ON DELETE CASCADE,
  PRIMARY KEY pk (uIDRequester, uIDInvitee) -- optimized for requester's view
);

COMMIT;
