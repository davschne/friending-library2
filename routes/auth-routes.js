var FacebookStrategy = require("passport-facebook").Strategy;

module.exports = function(router, db, redis, handle, passport, config) {

  passport.use(new FacebookStrategy(
    {
      clientID:     config.facebook.id,
      clientSecret: config.facebook.secret,
      callbackURL:  config.app_url + "/auth/facebook/callback",
      enableProof:  false
    },
    function(access_token, refreshToken, profile, done) {

      var id = profile.id;
      var displayName = profile.displayName;

      // create user tuple in Postgres (if it doesn't exist already)
      db.findOrCreateUser(id, displayName)
      .then(function() {
        // store in Redis (key: token, value: userID)
        // tokens expire after two hours
        return redis.set(access_token, id, 'ex', 7200);
      })
      .then(function() {
        // if successful, continue
        // (access_token will be added to req object as req.user)
        done(null, access_token);
      })
      .catch(function(err) {
        // if unsuccessful
        done(err);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  router.get("/facebook", passport.authenticate("facebook"));

  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {failureRedirect: "/"}),
    function(req, res) {
      // send access_token to client in query string
      res.redirect("/#/?access_token=" + req.user);
    }
  );
};
