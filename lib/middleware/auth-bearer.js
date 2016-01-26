var BearerStrategy = require("passport-http-bearer").Strategy;

var authenticate = function(redis, passport) {

  passport.use(new BearerStrategy(
    function(token, done) {
      redis.get(token)
      .then(function(userID) {
        if (!userID) {
          console.log("no userID");
          return done(null, false);
        } else {
          console.log("userID:", userID);
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
