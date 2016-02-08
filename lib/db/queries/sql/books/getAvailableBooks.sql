SELECT  b.isbn AS isbn,
        title,
        subtitle,
        authors,
        categories,
        publisher,
        publisheddate,
        description,
        pagecount,
        language,
        imagelink,
        volumelink,
        copyid,
        ownerid,
        u.display_name AS owner_display_name
FROM Copies c, Books b, Users u
WHERE b.isbn = c.isbn
  AND u.uid  = c.ownerid
  -- Return all books that aren't being borrowed, ...
  AND c.copyid NOT IN (
    SELECT copyid FROM Borrowing
  )
  -- ... haven't already been requested by the user, ...
  AND c.copyid NOT IN (
    SELECT copyid FROM BookRequests
    WHERE requesterid = $1
  )
  -- ... and don't belong to the user.
  AND c.ownerid <> $1;
-- ... and belong to one of the user's friends.
-- WHERE isbn IN (
--   SELECT isbn FROM Copies
--   WHERE ownerid IN (
--     SELECT uid2 FROM Friendships
--     WHERE uid1 = $1
--   )
-- );
