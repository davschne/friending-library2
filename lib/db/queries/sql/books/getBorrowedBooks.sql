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
        ownerID,
        display_name AS owner_display_name,
        checkout_date
FROM Borrowing brw, Users u, Copies c, Books b
WHERE brw.borrowerID = $1
  AND c.copyID = brw.copyID
  AND u.uID    = c.ownerID
  AND b.ISBN   = c.ISBN;
