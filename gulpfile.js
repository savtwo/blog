var concat = require("gulp-concat");
var cssmin = require("gulp-cssmin");
var del = require("del");
var eslint = require("gulp-eslint");
var inject = require("gulp-inject");
var gulp = require("gulp");
var gulpFilter = require("gulp-filter");
var mainBowerFiles = require("main-bower-files");
var ngAnnotate = require("gulp-ng-annotate");
var order = require("gulp-order");
var rename = require("gulp-rename");
var rev = require("gulp-rev");
var uglify = require("gulp-uglify");
var watch = require("gulp-watch");

/**
 * Run ESLinter against js
 *
 * @returns {Stream}
 */
gulp.task("eslint", function() {
  return gulp
    .src("public/app/**/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
  ;
});

/**
 * Remove all files from /dist
 *
 * @returns {Stream}
 */
gulp.task("clean", function() {
  return del(["public/dist/**/*", "public/fonts/**/*"]);
});

/**
 * Compress all source js together into /dist
 *
 * @returns {Stream}
 */
gulp.task("compress-js", ["clean"], function() {
  return gulp
    .src(["public/app/**/*.module.js", "public/app/**/*.js", "!public/app/**/*.spec.js"])
    .pipe(concat("app.js"))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("public/dist"))
  ;
});

/**
 * Compress all source css together into /dist
 *
 * @returns {Stream}
 */
gulp.task("compress-css", ["clean"], function() {
  var cssFilter = gulpFilter("*.css", { restore: true });
  
  return gulp
    .src("public/css/**/*")
  
    .pipe(cssFilter)
    // style.css should be last in order
    .pipe(order([
      "!**/style.css"
    ]))
    .pipe(concat("app.css"))
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("public/dist"))
    .pipe(cssFilter.restore)
  ;
});

/**
 * Concatenate and compress all bower js, css & fonts together into /dist
 *
 * @returns {Stream}
 */
gulp.task("compress-bower_components", ["clean"], function() {
  var jsFilter = gulpFilter("*.js", { restore: true });
  var cssFilter = gulpFilter("*.css", { restore: true });
  var faFontFilter = gulpFilter(["fontawesome*"], { restore: true });
  
  return gulp
    .src(mainBowerFiles())
  
    /** JS */
    .pipe(jsFilter)
    .pipe(concat("bower.js"))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("public/dist"))
    .pipe(jsFilter.restore)
  
    /** CSS */
    .pipe(cssFilter)
    .pipe(concat("bower.css"))
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("public/dist"))
    .pipe(cssFilter.restore)
  
    /** font-awesome */
    .pipe(faFontFilter)
    .pipe(gulp.dest("public/fonts"))
    .pipe(faFontFilter.restore)
  ;
});

/**
 * Concatenates all js together into one file.
 *
 * @returns {Stream}
 */
gulp.task("concat-min-js", ["compress-js", "compress-bower_components"], function() {
  return gulp
    .src(["public/dist/bower.min.js", "public/dist/app.min.js"])
    .pipe(concat("mh.min.js"))
    .pipe(rev())
    .pipe(gulp.dest("public/dist"))
  ;
});

/**
 * Concatenates all css together into one file.
 * @return {Stream}
 */
gulp.task("concat-min-css", ["compress-css", "compress-bower_components"], function() {
  return gulp
    .src(["public/dist/bower.min.css", "public/dist/app.min.css"])
    .pipe(concat("mh.min.css"))
    .pipe(rev())
    .pipe(gulp.dest("public/dist"))
  ;
});

/**
 * Injects JS/CSS into _index.html
 *
 * @returns {Stream}
 */
gulp.task("inject-dist", ["concat-min-js", "concat-min-css"], function() {
  var sources = gulp.src(["public/dist/mh*.min.js", "public/dist/mh*.min.css"], { read: false });
  
  return gulp
    .src(["public/_index.html"])
    .pipe(rename({ basename: "index" }))
    .pipe(inject(sources, { relative: true }))
    .pipe(gulp.dest("public/dist"))
  ;
});

/**
 * Injects dev JS/CSS into _index.html
 * This should be used for quick dev builds.
 *
 * @returns {Stream}
 */
gulp.task("inject-src", function() {
  var sources = gulp.src(mainBowerFiles().concat(["public/app/**/*.module.js", "public/app/**/*.js", "!public/app/**/*.spec.js", "public/css/**/oui.css", "public/css/**/*.css"]));
  
  return gulp
    .src(["public/_index.html"])
    .pipe(rename({ basename: "index" }))
    .pipe(inject(sources, { relative: true }))
    .pipe(gulp.dest("public/dist"))
  ;
});

gulp.task("dist-build", ["clean", "inject-dist", "eslint"]);
gulp.task("dev-build", ["inject-src", "eslint"]);
gulp.task("dev-watch", function() {
  watch(["public/bower_components/**/*", "public/app/**/*.js", "public/css/**/*"], function() {
    gulp.start("dev-build");
  });
});
