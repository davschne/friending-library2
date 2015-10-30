var FB_ID     = process.env.FB_ID;
var FB_SECRET = process.env.FB_SECRET;
var APP_URL   = process.env.APP_URL || "localhost:3000";

var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
// var User = require("../models/User");


module.exports = function(router, pg, redis) {

  passport.use(new FacebookStrategy({
    clientID:     FB_ID,
    clientSecret: FB_SECRET,
    callbackURL:  APP_URL + "/facebook/callback",
    enableProof:  false
    },
    function(access_token, refreshToken, profile, done) {
      var id = profile.id;
      var displayName = profile.displayName;
      pg.query({
        name: "find-or-create-user",
        text: "INSERT INTO Users (uID, displayName)
              SELECT $1, $2
              WHERE NOT EXISTS (
                SELECT uID
                FROM Users
                WHERE uID = $1
              )",
        values: [id, displayName]
      })
      .then(function() {
        return redis.set(access_token, id);
      })
      .then(function() {
        var user = {
          _id: id,
          displayName: displayName
        };
        done(null, user);
      })
      .catch(function(err) {
        done(err);
      });
      // User.findOrCreate({
      //   _id: profile.id
      // }, {
      //   displayName: profile.displayName
      // }, function(err, user) {
      //   if (user) {
      //     user.access_token = access_token;
      //     user.save(function(err, savedUser) {
      //       done(err, savedUser);
      //     });
      //   } else {
      //     done(err, user);
      //   }
      // });
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
      res.redirect("/#/success?access_token=" + req.user.access_token);
    });
};
