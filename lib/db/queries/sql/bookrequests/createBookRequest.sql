INSERT INTO BookRequests (requesterID, copyID, request_date)
VALUES ($1, $2, CURRENT_TIMESTAMP);
