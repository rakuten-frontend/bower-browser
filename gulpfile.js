'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('lint', function () {
  return gulp.src(['*.js', 'lib/*.js', 'lib/client/assets/scripts/**/*.js'])
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['lint']);
gulp.task('default', ['test']);
