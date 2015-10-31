var handle = require("../lib/handle");
var authenticate = require("../middleware/auth-bearer");

module.exports = function(router, redis) {

  router.get("/login", function(req, res) {
    res.redirect(302, "/auth/facebook");
  });

  router.post("/logout", authenticate, function(req, res) {
    redis.del(req.user._id)
      .then(function(result) {
        res.json({msg: "Log-out successful"});
      })
      .catch(function(err) {
        handle[500](err, res);
      });
  });
};
