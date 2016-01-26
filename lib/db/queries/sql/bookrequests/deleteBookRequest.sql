DELETE FROM BookRequests
WHERE requesterID = $1
  AND copyID      = $2
RETURNING copyID;
