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
WHERE ISBN IN (
  SELECT ISBN FROM Copies
  WHERE ownerid = $1
);
