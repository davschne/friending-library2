BEGIN;

CREATE TABLE Users (
  uID bigint,
  display_name varchar,
  -- given_name varchar,
  -- surname varchar,
  PRIMARY KEY (uID)
);

-- index for user searches
-- CREATE INDEX UserNames ON Users (surname, given_name);

-- CREATE TABLE Friendship (
--   uID1 bigint REFERENCES Users (uID) ON DELETE CASCADE,
--   uID2 bigint REFERENCES Users (uID) ON DELETE CASCADE,
--   PRIMARY KEY (uID1, uID2)
-- );

CREATE TABLE Books (
  ISBN integer,
  title varchar,
  subtitle varchar,
  authors varchar ARRAY,    -- (denormalized)
  categories varchar ARRAY, -- (denormalized)
  publisher varchar,
  publishedDate integer,
  description varchar,
  pageCount integer,
  language varchar,
  imageLink varchar,
  PRIMARY KEY (ISBN)
);

CREATE TABLE Authors (
  aID serial,
  surname varchar,
  given_name varchar,
  PRIMARY KEY (aID)
);

-- for searching books by author name
CREATE INDEX AuthorNames ON Authors (surname, given_name);

CREATE TABLE Wrote (
  aID integer REFERENCES Authors ON DELETE CASCADE,
  ISBN integer REFERENCES Books ON DELETE CASCADE,
  PRIMARY KEY (aID, ISBN)
);

-- for searching books by category
CREATE TABLE BooksToCategories (
  category varchar,
  ISBN integer REFERENCES Books ON DELETE CASCADE,
  PRIMARY KEY (category, ISBN)
);

CREATE TABLE Copies (
  copyID serial,
  ISBN integer REFERENCES Books ON DELETE CASCADE,
  ownerID bigint REFERENCES Users (uID) ON DELETE CASCADE,
  PRIMARY KEY (copyID),
  UNIQUE (ownerID, ISBN, copyID)
);

CREATE TABLE Borrowing (
  borrowerID bigint REFERENCES Users (uID) ON DELETE RESTRICT,
  copyID integer REFERENCES Copies ON DELETE CASCADE,
  checkout_date TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (borrowerID, copyID)
);

CREATE TABLE BookRequests (
  requesterID bigint REFERENCES Users (uID) ON DELETE CASCADE,
  copyID integer REFERENCES Copies ON DELETE CASCADE,
  request_date TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (requesterID, copyID)
  -- optimized for requester's view ; possible to optimize for book owner?
  -- separate indexes on the columns?
);

-- CREATE TABLE FriendRequests (
--   requesterID bigint REFERENCES Users ON DELETE CASCADE,
--   inviteeID bigint REFERENCES Users ON DELETE CASCADE,
--   PRIMARY KEY (requesterID, inviteeID)
--   -- optimized for requester's view ; possible to optimize for invitee?
--   -- separate indexes on the columns?
-- );

COMMIT;
