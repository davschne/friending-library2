DELETE FROM Borrowing
  WHERE borrowerID = $1
    AND copyID     = $2;
