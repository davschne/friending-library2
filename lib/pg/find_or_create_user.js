module.exports = function(pg, id, displayName) {
  return pg.query({
    name: "find-or-create-user",
    text: "INSERT INTO Users (uID, display_name) " +
          "SELECT $1, $2 " +
          "WHERE NOT EXISTS ( " +
            "SELECT uID " +
            "FROM Users " +
            "WHERE uID = $1 " +
          ")",
    values: [id, displayName]
  });
};
