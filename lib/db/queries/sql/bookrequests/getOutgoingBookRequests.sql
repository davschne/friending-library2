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
        r.copyid AS copyid,
        ownerid,
        display_name AS owner_display_name,
        request_date
FROM BookRequests r, Users u, Copies c, Books b
WHERE r.requesterid = $1
  AND c.copyid = r.copyid
  AND u.uid    = c.ownerid
  AND b.isbn   = c.isbn;
