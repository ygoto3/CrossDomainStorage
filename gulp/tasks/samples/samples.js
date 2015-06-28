var gulp = require('gulp');

gulp.task('samples', [
  'samples:browserify',
  'samples:jade',
  'samples:copy'
]);
