INSERT INTO Borrowing (borrowerID, copyID, checkout_date)
  VALUES ($1, $2, CURRENT_TIMESTAMP);
