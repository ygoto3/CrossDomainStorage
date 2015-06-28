var gulp = require('gulp');
var connect = require('gulp-connect');
var config = require('../../config');

gulp.task('samples:connect', function () {
  connect.server(config.samples.host.connect);
});
gulp.task('samples:connect_storage', function () {
  connect.server(config.samples.storage.connect);
});
