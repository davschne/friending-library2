SELECT  b.ISBN AS ISBN,
        title,
        subtitle,
        authors,
        categories,
        publisher,
        publishedDate,
        description,
        pageCount,
        language,
        imageLink,
        imageLinkSmall,
        copyid,
        ownerID,
        u.display_name AS owner_display_name
FROM Copies c, Books b, Users u
WHERE b.ISBN = c.ISBN
  AND u.uID  = c.ownerID
  -- Return all books that aren't being borrowed, ...
  AND c.copyID NOT IN (
    SELECT copyID FROM Borrowing
  )
  -- ... haven't already been requested by the user, ...
  AND c.copyID NOT IN (
    SELECT copyID FROM BookRequests
    WHERE requesterID = $1
  )
  -- ... and don't belong to the user.
  AND c.ownerid <> $1;
-- ... and belong to one of the user's friends.
-- WHERE ISBN IN (
--   SELECT ISBN FROM Copies
--   WHERE ownerid IN (
--     SELECT uid2 FROM Friendships
--     WHERE uid1 = $1
--   )
-- );
