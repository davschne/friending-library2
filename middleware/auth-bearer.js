var BearerStrategy = require("passport-http-bearer").Strategy;
var passport = require("passport");

var authenticate = function(redis) {

  passport.use(new BearerStrategy(
    function(token, done) {
      // Seems to be a problem here after logging out, then back in.
      // Cannot read property 'then' of undefined
      redis.get(token)
      .then(function(userID) {
        if (!userID) {
          // console.log('no userID');
          return done(null, false);
        } else {
          // console.log('userID :', userID);
          return done(null, {uid: userID, token: token}, {scope: "all"});
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
