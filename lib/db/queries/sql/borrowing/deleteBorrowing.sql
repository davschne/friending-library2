DELETE FROM Borrowing
WHERE borrowerid = $1
  AND copyid     = $2;
