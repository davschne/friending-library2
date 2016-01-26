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
        r.copyID AS copyID,
        r.requesterID AS requesterID,
        u.display_name AS requester_display_name,
        request_date
FROM BookRequests r, Users u, Copies c, Books b
WHERE r.copyID IN (
    SELECT copyID
    FROM   Copies
    WHERE  ownerID = $1
  )
  AND c.copyID = r.copyID
  AND u.uID    = r.requesterID
  AND b.ISBN   = c.ISBN;
