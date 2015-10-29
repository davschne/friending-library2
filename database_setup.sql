BEGIN;

CREATE TABLE Users (
  uID serial,
  display_name varchar,
  given_name varchar,
  surname varchar,
  PRIMARY KEY pk (uID)
);

CREATE INDEX UserNames ON Users (surname, given_name); -- index for user searches

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
  given_name varchar,
  PRIMARY KEY pk (aID)
);

CREATE INDEX AuthorNames ON Authors (surname, given_name); -- index for searches by author name

CREATE TABLE Wrote (
  aID integer REFERENCES Authors ON DELETE CASCADE,
  ISBN integer REFERENCES Books ON DELETE CASCADE,
  PRIMARY KEY pk (aID, ISBN)
);

CREATE TABLE Copies (
  copyID serial,
  ISBN integer REFERENCES Books ON DELETE CASCADE,
  ownerID integer REFERENCES Users ON DELETE CASCADE,
  PRIMARY KEY pk (ownerID, ISBN, copyID)
);

CREATE TABLE Borrowing (
  borrowerID integer REFERENCES Users ON DELETE RESTRICT,
  copyID integer REFERENCES Copies ON DELETE CASCADE,
  checkout_date TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY pk (borrowerID, copyID)
);

CREATE TABLE BookRequests (
  requesterID integer REFERENCES Users ON DELETE CASCADE,
  copyID integer REFERENCES Copies ON DELETE CASCADE,
  request_date TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY pk (requesterID, copyID)
  -- optimized for requester's view ; possible to optimize for book owner?
  -- separate indexes on the columns?
);

CREATE TABLE FriendRequests (
  requesterID integer REFERENCES Users ON DELETE CASCADE,
  inviteeID integer REFERENCES Users ON DELETE CASCADE,
  PRIMARY KEY pk (requesterID, inviteeID)
  -- optimized for requester's view ; possible to optimize for invitee?
  -- separate indexes on the columns?
);

COMMIT;
