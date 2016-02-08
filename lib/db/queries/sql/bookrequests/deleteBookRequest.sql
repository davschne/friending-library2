DELETE FROM BookRequests
WHERE requesterid = $1
  AND copyid      = $2
RETURNING copyid;
