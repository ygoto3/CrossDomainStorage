var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var config = require('../../config');

gulp.task('samples:browserify', function () {
  gulp.src(config.samples.host.browserify.src)
      .pipe(browserify(config.samples.host.browserify.settings))
      .pipe(rename(config.samples.host.js.file_name))
      .pipe(gulp.dest(config.samples.host.js.dest));

  gulp.src(config.samples.storage.browserify.src)
      .pipe(browserify(config.samples.storage.browserify.settings))
      .pipe(rename(config.samples.storage.js.file_name))
      .pipe(gulp.dest(config.samples.storage.js.dest));
});
