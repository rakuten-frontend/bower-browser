'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('lint', function () {
  return gulp.src(['gulpfile.js', 'lib/*.js', 'lib/assets/scripts/**/*.js'])
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['lint']);
