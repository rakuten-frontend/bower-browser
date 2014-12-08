'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var assetsDir = './lib/client/assets/';

gulp.task('lint', function () {
  return gulp.src(['./*.js', './lib/*.js', assetsDir + 'scripts/**/*.js'])
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('styles', function () {
  return gulp.src(assetsDir + 'styles/*.scss')
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe(gulp.dest(assetsDir + 'styles'));
});

gulp.task('test', ['lint']);
gulp.task('build', ['styles']);
gulp.task('default', ['test', 'build']);
