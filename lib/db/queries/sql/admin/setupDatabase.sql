BEGIN;

CREATE TABLE Users (
  uid serial,
  facebookid bigint,
  display_name varchar,
  -- given_name varchar,
  -- surname varchar,
  PRIMARY KEY (uid),
  -- index for quick login
  UNIQUE (facebookid)
);

-- index for user searches
-- CREATE INDEX UserNames ON Users (surname, given_name);

-- CREATE TABLE Friendships (
--   uid1 integer REFERENCES Users (uid) ON DELETE CASCADE,
--   uid2 integer REFERENCES Users (uid) ON DELETE CASCADE,
--   PRIMARY KEY (uid1, uid2)
-- );

CREATE TABLE Books (
  isbn varchar,
  title varchar,
  subtitle varchar,
  authors varchar ARRAY,    -- (denormalized)
  categories varchar ARRAY, -- (denormalized)
  publisher varchar,
  publisheddate varchar,
  description varchar,
  pagecount integer,
  language varchar,
  imagelink varchar,
  volumelink varchar,
  PRIMARY KEY (isbn)
);

-- CREATE TABLE Authors (
--   aid serial,
--   surname varchar,
--   given_name varchar,
--   PRIMARY KEY (aid)
-- );

-- -- for searching books by author name
-- CREATE INDEX AuthorNames ON Authors (surname, given_name);

-- CREATE TABLE Wrote (
--   aid integer REFERENCES Authors ON DELETE CASCADE,
--   isbn varchar REFERENCES Books ON DELETE CASCADE,
--   PRIMARY KEY (aid, isbn)
-- );

-- for searching books by category
-- CREATE TABLE BooksToCategories (
--   category varchar,
--   isbn varchar REFERENCES Books ON DELETE CASCADE,
--   PRIMARY KEY (category, isbn)
-- );

CREATE TABLE Copies (
  copyid serial,
  isbn varchar REFERENCES Books ON DELETE CASCADE,
  ownerid integer REFERENCES Users (uid) ON DELETE CASCADE,
  PRIMARY KEY (copyid),
  UNIQUE (ownerid, isbn, copyid)
);

CREATE TABLE Borrowing (
  borrowerid integer REFERENCES Users (uid) ON DELETE RESTRICT,
  copyid integer REFERENCES Copies ON DELETE CASCADE,
  checkout_date TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (borrowerid, copyid)
);

CREATE TABLE BookRequests (
  requesterid integer REFERENCES Users (uid) ON DELETE CASCADE,
  copyid integer REFERENCES Copies ON DELETE CASCADE,
  request_date TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (requesterid, copyid)
  -- optimized for requester's view. possible to optimize for book owner?
  -- separate indexes on the columns?
);

-- CREATE TABLE FriendRequests (
--   requesterid integer REFERENCES Users ON DELETE CASCADE,
--   inviteeID integer REFERENCES Users ON DELETE CASCADE,
--   PRIMARY KEY (requesterid, inviteeID)
--   -- optimized for requester's view. possible to optimize for invitee?
--   -- separate indexes on the columns?
-- );

COMMIT;
