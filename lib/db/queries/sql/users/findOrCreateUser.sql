-- create user if not found
INSERT INTO Users (facebookid, display_name)
SELECT $1, $2
WHERE NOT EXISTS (
  SELECT facebookid
  FROM Users
  WHERE facebookid = $1
);
-- return user ID regardless
SELECT uid
FROM Users
WHERE facebookid = $1;
