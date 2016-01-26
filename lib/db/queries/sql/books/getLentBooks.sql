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
        brw.copyID AS copyID,
        borrowerID,
        u.display_name AS borrower_display_name,
        checkout_date
FROM Borrowing brw, Users u, Copies c, Books b
WHERE brw.copyID IN (
    SELECT copyID
    FROM   Copies
    WHERE  ownerID = $1
  )
  AND c.copyID = brw.copyID
  AND u.uID    = brw.borrowerID
  AND b.ISBN   = c.ISBN;
