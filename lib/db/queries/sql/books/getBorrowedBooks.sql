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
        ownerid,
        display_name AS owner_display_name,
        checkout_date
FROM Borrowing brw, Users u, Copies c, Books b
WHERE brw.borrowerid = $1
  AND c.copyid = brw.copyid
  AND u.uid    = c.ownerid
  AND b.isbn   = c.isbn;
