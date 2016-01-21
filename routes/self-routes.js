var handle = require("../lib/handle");

module.exports = function(router, db, redis) {
  router.route("/")
  .get(function(req, res) {
    console.log("Received GET request at /api/self");
    res.json({message: "not implemented"});
  })
  .delete(function(req, res) {
    console.log("Received DELETE request at /api/self");
    db.deleteUser(req.user.uid)
    .then(function(db_res) {
      // if db operation successful, deleted User's uid returned
      if (!db_res[0] || db_res[0].uid !== req.user.uid.toString()) {
        handle[404](new Error("User tuple not found"), res);
      }
      else return redis.del(req.user.token)
        .then(function() {
          res.json({message: "user deleted"});
        });
    })
    .catch(function(err) {
      if (err.cause && err.cause.message == 'update or delete on table "users" violates foreign key constraint "borrowing_borrowerid_fkey" on table "borrowing"') {
        handle[403](err, res);
      }
      else handle[500](err, res);
    });
  });

  router.route("/books")
  .get(function(req, res) {
    console.log("Received GET request at /api/self/books");
    db.getOwnBooks(req.user.uid)
    .then(function(db_res) {
      res.json(db_res);
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });

  router.route("/book_requests/incoming")
  .get(function(req, res) {
    console.log("Received GET request at /api/self/book_requests/incoming");
    db.getIncomingBookRequests(req.user.uid)
    .then(function(db_res) {
      res.json(db_res);
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });

  router.route("/book_requests/outgoing")
  .get(function(req, res) {
    console.log("Received GET request at /api/self/book_requests/outgoing");
    db.getOutgoingBookRequests(req.user.uid)
    .then(function(db_res) {
      res.json(db_res);
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });

  router.route("/books_lent")
  .get(function(req, res) {
    console.log("Received GET request at /api/self/books_lent");
    db.getLentBooks(req.user.uid)
    .then(function(db_res) {
      res.json(db_res);
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  });

  router.route("/books_borrowed")
  .get(function(req, res) {
    console.log("Received GET request at /api/self/books_borrowed");
    db.getBorrowedBooks(req.user.uid)
    .then(function(db_res) {
      res.json(db_res);
    })
    .catch(function(err) {
      handle[500](err, res);
    });
  })
};
