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
    db.deleteBookRequest(req.user.uid, copyid)
    .then(function(db_res) {
      if (!db_res[0] || db_res[0].copyid.toString() !== copyid) {
        handle[404](new Error("Book request not found"), res);
      }
      else res.json({ message: "Book request deleted"});
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });

  router.post("/deny", function(req, res) {
    console.log("Received POST request at /api/trans/deny");
    var copyid = req.body.copyid;
    db.deleteBookRequest(req.body.requesterid, copyid)
    .then(function(db_res) {
      if (!db_res[0] || db_res[0].copyid !== copyid) {
        handle[404](new Error("Book request not found"), res);
      }
      else res.json({ message: "Book request deleted"});
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });

  router.post("/checkout", function(req, res) {
    console.log("Received POST request at /api/trans/checkout");
    db.checkoutBook(req.body.requesterid, req.body.copyid)
    .then(function(db_res) {
      res.json({ message: "Book checked out" });
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });

  router.post("/checkin", function(req, res) {
    console.log("Received POST request at /api/trans/checkin");
    res.json({});
  });
};
