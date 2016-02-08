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
        r.requesterid AS requesterid,
        u.display_name AS requester_display_name,
        request_date
FROM BookRequests r, Users u, Copies c, Books b
WHERE r.copyid IN (
    SELECT copyid
    FROM   Copies
    WHERE  ownerid = $1
  )
  AND c.copyid = r.copyid
  AND u.uid    = r.requesterid
  AND b.isbn   = c.isbn;
