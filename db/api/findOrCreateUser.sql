INSERT INTO Users (uID, display_name)
  SELECT $1, $2
  WHERE NOT EXISTS (
    SELECT uID
    FROM Users
    WHERE uID = $1
  );
