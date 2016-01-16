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
        ARRAY(
          SELECT copyid FROM Copies c
          WHERE c.ISBN = b.ISBN
        ) AS copyids
FROM Books b
-- return all books that don't belong to the user
WHERE ISBN NOT IN (
  SELECT ISBN FROM Copies
  WHERE ownerid = $1
);
-- return only friends' books
-- WHERE ISBN IN (
--   SELECT ISBN FROM Copies
--   WHERE ownerid IN (
--     SELECT uid2 FROM Friendships
--     WHERE uid1 = $1
--   )
-- );
