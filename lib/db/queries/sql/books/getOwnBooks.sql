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
        copyid
FROM Books b, Copies c
WHERE ownerid = $1
  AND b.isbn = c.isbn;
