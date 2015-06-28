var gulp = require('gulp');
var jade = require('gulp-jade');
var config = require('../../config');

gulp.task('samples:jade', function () {
  gulp.src(config.samples.templates.jade.src)
      .pipe(jade({}))
      .pipe(gulp.dest(config.samples.templates.html.dest));
});
