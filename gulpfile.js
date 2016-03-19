"use strict";

var gulp        = require("gulp");
var del         = require("del");
var sass        = require("gulp-sass");
var webpack     = require("gulp-webpack");
var uglify      = require("gulp-uglify");
var minifyCSS   = require("gulp-minify-css");
var svgmin      = require("gulp-svgmin");
var minifyHTML  = require("gulp-minify-html");
var mocha       = require("gulp-mocha");
var KarmaServer = require("karma").Server;
// var jshint      = require("gulp-jshint");
var exec = require("child_process").exec;

gulp.task("sass", function() {
  gulp.src("./client/src/sass/application.scss")
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(minifyCSS({compaibility: "ie8"}))
    .pipe(gulp.dest("./client/build/"));
});

gulp.task("svgmin", function() {
  gulp.src("./client/src/images/**/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("./client/build/images/"));
});

gulp.task("webpack:dev", function() {
  return gulp.src("./client/src/client.js")
    .pipe(webpack({
      output: {
        filename: "bundle.js"
      }
     }))
    // .pipe(uglify())
    .pipe(gulp.dest("./client/build/"));
});

gulp.task("webpack:test", function() {
  return gulp.src("test/karma_test/entry.js")
    .pipe(webpack({
      output: {
        filename: "test_bundle.js"
      }
    }))
    .pipe(gulp.dest("test/karma_test/"));
});

gulp.task("copy-html", function() {
  var opts = {
    conditionals: true,
    spare: true
  };
  return gulp.src("./client/src/**/*.html")
    .pipe(gulp.dest("./client/build/"))
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest("./client/build/"));
});

gulp.task("copy", function() {
  return gulp.src([
    // "./client/src/**/*.css", // style sheets
    "./client/src/**/*.otf",
    "./client/src/**/*.ttf",
    "./client/src/**/*.png"])
    .pipe(gulp.dest("./client/build/"));
});

gulp.task("clean", function() {
  del.sync(["./client/build/**", "!client/build"]);
});

gulp.task("server-test", function() {
  return gulp.src([
      "./test/mocha_test/setup-tests.js",
      "./test/mocha_test/db-tests.js",
      "./test/mocha_test/api-tests.js",
      "./test/mocha_test/cleanup-tests.js"
    ])
    .pipe(mocha());
});

gulp.task("client-test", ["webpack:test"], function(done) {
  new KarmaServer({
    configFile: __dirname + "/karma.conf.js"
  }, done)
  .start();
});

// create Postgres user, database, and schema
gulp.task("db-setup", function() {
  var setup = exec("node lib/db/db-setup");
  setup.stdout.on("data", function(data) {
    console.log(data.toString());
  });
});

// drop Postgres database and user
gulp.task("db-breakdown", function() {
  var breakdown = exec("node lib/db/db-breakdown");
  breakdown.stdout.on("data", function(data) {
    console.log(data.toString());
  });
});

// populate Postgres and Redis databases with test data
gulp.task("test-populate", function() {
  var populate = exec("node lib/test/populate-db");
  populate.stdout.on("data", function(data) {
    console.log(data.toString());
  });
});

// empty Postgres and Redis databases
gulp.task("test-empty", function() {
  var empty = exec("node lib/test/empty-db");
  empty.stdout.on("data", function(data) {
    console.log(data.toString());
  });
});

// run server (as child process)
gulp.task("start", function() {
  var app = exec("node server");
  app.stdout.on("data", function(data) {
    console.log(data.toString());
  });
  app.stderr.on("data", function(data) {
    console.error(data.toString());
  });
});

gulp.task("test", ["server-test", "client-test"]);

gulp.task("compile", ["clean", "sass", "svgmin", "copy-html", "copy", "webpack:dev"]);

gulp.task("build", ["test", "compile"]);

gulp.task("watch", function() {
  gulp.watch("./client/src/**/*", ["compile"]);
});

gulp.task("default", ["build", "db-setup"]);

// gulp.task("lint", function() {
//   return gulp.src(["./routes/*.js", "./test/*.js", "./middleware/*.js", "./models/*.js", "./lib/*.js", "./server.js"])
//     .pipe(jshint())
//     .pipe(jshint.reporter("default"));
// });

