'use strict';

var gulp        = require("gulp");
var del         = require("del");
var sass        = require("gulp-sass");
var webpack     = require("gulp-webpack");
var uglify      = require("gulp-uglify");
var minifyCSS   = require("gulp-minify-css");
var minifyHTML  = require("gulp-minify-html");
var mocha       = require("gulp-mocha");
var KarmaServer = require("karma").Server;
// var jshint      = require("gulp-jshint");
var exec = require("child_process").exec;

gulp.task('sass', function() {
  gulp.src('./app/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(minifyCSS({compaibility: 'ie8'}))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('sass:watch', function() {
  gulp.watch('./app/sass/**/*.scss', ['sass']);
});

gulp.task('webpack:dev', function() {
  return gulp.src('./app/js/client.js')
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
     }))
    // .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('webpack:test', function() {
  return gulp.src('test/karma_test/entry.js')
    .pipe(webpack({
      output: {
        filename: 'test_bundle.js'
      }
    }))
    .pipe(gulp.dest('test/karma_test/'));
});

gulp.task('copy-html', function() {
  var opts = {
    conditionals: true,
    spare: true
  };
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('./public/'))
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./public/'));
});

gulp.task('copy', function() {
  return gulp.src([
    './app/**/*.otf',
    './app/**/*.ttf',
    './app/**/*.svg',
    './app/**/*.png'])
    .pipe(gulp.dest('./public/'));
});

gulp.task("clean", function() {
  del.sync(["./public/**", "!public"]);
})

gulp.task("server_test", function() {
  return gulp.src([
      "./test/mocha_test/setup-tests.js",
      "./test/mocha_test/db-tests.js",
      "./test/mocha_test/api-tests.js",
      "./test/mocha_test/cleanup-tests.js"
    ])
    .pipe(mocha());
});

gulp.task("client_test", ["webpack:test"], function(done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done)
  .start();
});

// create Postgres user, database, and schema
gulp.task("db_setup", function(done) {
  var setupUtil = exec("node lib/db/db_setup");
  setupUtil.stdout.on("data", function(data) {
    console.log(data.toString());
  });
});

// drop Postgres database and user
gulp.task("db_breakdown", function(done) {
  var setupUtil = exec("node lib/db/db_breakdown");
  setupUtil.stdout.on("data", function(data) {
    console.log(data.toString());
  });
});

// run server (as child process)
gulp.task("start", function(done) {
  var app = exec("node server");
  app.stdout.on("data", function(data) {
    console.log(data.toString());
  });
  app.stderr.on("data", function(data) {
    console.error(data.toString());
  });
});

gulp.task("test", ["server_test", "client_test"]);

gulp.task("compile", ["clean", "sass", "copy-html", "copy", "webpack:dev"]);

gulp.task("build", ["test", "compile"]);

gulp.task("default", ["build", "db_setup"]);

// gulp.task("lint", function() {
//   return gulp.src(["./routes/*.js", "./test/*.js", "./middleware/*.js", "./models/*.js", "./lib/*.js", "./server.js"])
//     .pipe(jshint())
//     .pipe(jshint.reporter("default"));
// });

