var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var config = require('../config');

gulp.task('browserify', function () {
  gulp.src(config.browserify.src)
      .pipe(browserify(config.browserify.settings))
      .pipe(rename(config.js.file_name))
      .pipe(gulp.dest(config.js.dest))
      .pipe(uglify())
      .pipe(rename(config.js.file_name_min))
      .pipe(gulp.dest(config.js.dest));
});
