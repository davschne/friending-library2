var FB_ID     = process.env.FB_ID;
var FB_SECRET = process.env.FB_SECRET;
var APP_URL   = process.env.APP_URL || "http://localhost:3000";

var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;

module.exports = function(router, pg, redis) {

  passport.use(new FacebookStrategy({
    clientID:     FB_ID,
    clientSecret: FB_SECRET,
    callbackURL:  APP_URL + "/auth/facebook/callback",
    enableProof:  false
    },
    function(access_token, refreshToken, profile, done) {

      var id = profile.id;
      var displayName = profile.displayName;

      // create user tuple in Postgres (if it doesn't exist already)
      pg.query({
        name: "find-or-create-user",
        text: "INSERT INTO Users (uID, display_name) " +
              "SELECT $1, $2 " +
              "WHERE NOT EXISTS ( " +
                "SELECT uID " +
                "FROM Users " +
                "WHERE uID = $1 " +
              ")",
        values: [id, displayName]
      })
      .then(function() {
        // store in Redis (key: token, value: userID)
        // tokens expire after two hours
        return redis.set(access_token, id, 'ex', 7200);
      })
      .then(function() {
        // if successful, continue
        // (access_token will be added to req object)
        done(null, access_token);
      })
      .catch(function(err) {
        // if unsuccessful
        done(err);
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  router.get("/facebook",
    passport.authenticate("facebook"));

  router.get("/facebook/callback",
    passport.authenticate("facebook", {failureRedirect: "/"}),
    function(req, res) {
      // send access_token to client in query string
      res.redirect("/#/success?access_token=" + req.access_token);
    });
};
