var BearerStrategy = require("passport-http-bearer").Strategy;
var passport = require("passport");

var authenticate = function(redis) {

  passport.use(new BearerStrategy(
    function(token, done) {

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
      }
    ));

  return passport.authenticate("bearer", {session: false});
};


module.exports = authenticate;
