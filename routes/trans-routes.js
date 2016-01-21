var handle = require("../lib/handle");

module.exports = function(router, db) {

  router.post("/request", function(req, res) {
    console.log("Received POST request at api/trans/request");
    db.createBookRequest(req.user.uid, req.body.copyid)
    .then(function(db_res) {
      res.json({ message: "Book requested" });
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });

  router.delete("/request/:copyid", function(req, res) {
    var copyid = req.params.copyid;
    console.log("Received DELETE request at /api/trans/request/" + copyid);
    res.json({});
  });

  router.post("/deny", function(req, res) {
    console.log("Received POST request at /api/trans/deny");
  });

  router.post("/checkout", function(req, res) {
    console.log("Received POST request at /api/trans/checkout");
    res.json({});
  });

  router.post("/checkin", function(req, res) {
    console.log("Received POST request at /api/trans/checkin");
    res.json({});
  });
};
