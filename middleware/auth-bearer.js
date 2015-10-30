var BearerStrategy = require("passport-http-bearer").Strategy;
var passport = require("passport");
// var User = require("../models/User");

passport.use(new BearerStrategy(
  function(token, done) {

    var redis = req.redis;
    redis.get(token)
      .then(function(userID) {
        if (!userID) {
          return done(null, false);
        } else {
          console.log(userID);
          return done(null, userID, {scope: "all"});
        }
      })
      .catch(function(err) {
        return done(err);
      });
    // User.findOne({access_token: token},
    //   function(err, user) {
    //     if (err) {
    //       return done(err);
    //     }
    //     if (!user) {
    //       return done(null, false);
    //     }
    //     else {
    //       return done(null, user, {scope: "all"});
    //     }
    //   });
    }
  ));

module.exports = passport.authenticate("bearer", {session: false});
