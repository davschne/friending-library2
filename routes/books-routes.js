module.exports = function(router, db, handle) {

  router.post("/", function(req, res) {
    console.log("Received POST request at /api/books");
    var book = req.body;
    db.createCopy(req.user.uid, book)
    .then(function(db_res) {
      res.json(db_res); // send back copyid for inserted copy
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });

  router.delete("/:copyid", function(req, res) {
    var copyid = req.params.copyid;
    console.log("Received DELETE request at /api/books/" + copyid);
    db.deleteCopy(copyid)
    .then(function(db_res) {
      // if db operation successful, deleted Copy's copyid returned
      if (!db_res[0] || db_res[0].copyid.toString() !== copyid) {
        handle[404](new Error("Copy tuple not found"), res);
      }
      else res.json({message: "copy deleted"});
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });

  router.get("/available", function(req, res) {
    console.log("Received GET request at /api/books/available");
    db.getAvailableBooks(req.user.uid)
    .then(function(db_res) {
      res.json(db_res);
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });
};
