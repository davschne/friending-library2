INSERT INTO Books (
  isbn,
  title,
  subtitle,
  authors,
  categories,
  publisher,
  publisheddate,
  description,
  pagecount,
  language,
  imagelink,
  volumelink
)
SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
WHERE NOT EXISTS (
  SELECT isbn
  FROM Books
  WHERE isbn = CAST($1 AS varchar)
);
