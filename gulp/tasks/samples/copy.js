var gulp = require('gulp');
var config = require('../../config');

gulp.task('samples:copy', function () {
  gulp.src(config.samples.css.bootstrap)
      .pipe(gulp.dest(config.samples.css.dest));
});
