module.exports = function(router, redis, handle, authenticate) {

  router.get("/login", function(req, res) {
    console.log("Received GET request at /login");
    res.redirect(302, "/auth/facebook");
  });

  router.post("/logout", authenticate, function(req, res) {
    console.log("Received POST request at /logout");
    redis.del(req.user.token)
    .then(function(result) {
      res.json({ message: "Logout successful" });
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });
};
