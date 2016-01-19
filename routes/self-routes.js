var handle = require("../lib/handle");

module.exports = function(router, db) {
  router.route("/")
  .get(function(req, res) {
    console.log("Received GET request at /api/self");
    res.json({msg: "not implemented"});
  })
  .delete(function(req, res) {
    console.log("Received DELETE request at /api/self");
    res.json({msg: "okay"});
  });

  router.route("/books")
  .get(function(req, res) {
    console.log("Received GET request at /api/self/books");
    var user = req.user;
    res.json({msg: "okay"});
  });
};
