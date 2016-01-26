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
        ownerID,
        display_name AS owner_display_name,
        request_date
FROM BookRequests r, Users u, Copies c, Books b
WHERE r.requesterID = $1
  AND c.copyID = r.copyID
  AND u.uID    = c.ownerID
  AND b.ISBN   = c.ISBN;
