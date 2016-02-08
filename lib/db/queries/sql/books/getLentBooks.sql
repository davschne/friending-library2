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
        brw.copyid AS copyid,
        borrowerid,
        u.display_name AS borrower_display_name,
        checkout_date
FROM Borrowing brw, Users u, Copies c, Books b
WHERE brw.copyid IN (
    SELECT copyid
    FROM   Copies
    WHERE  ownerid = $1
  )
  AND c.copyid = brw.copyid
  AND u.uid    = brw.borrowerid
  AND b.isbn   = c.isbn;
