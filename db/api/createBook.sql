-- insert book tuple (if it doesn't already exist)
INSERT INTO Books (
  ISBN,
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
  imageLinkSmall
)
SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12;
-- WHERE NOT EXISTS (
--   SELECT ISBN
--   FROM Books
--   WHERE ISBN = $1
-- );
