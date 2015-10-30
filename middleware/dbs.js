// Middleware that attaches Postgres and Redis instances to request object
// for use in later handlers

var dbs = function(pg, redis) {

  return function(req, res, next) {
    req.pg = pg;
    req.redis = redis;
    next();
  };
};

module.exports = dbs;
