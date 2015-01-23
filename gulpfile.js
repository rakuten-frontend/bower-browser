'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var pipe = require('multipipe');

var assetsDir = './lib/client/assets';
var scripts = [
  './*.js',
  './lib/*.js',
  './test/*.js',
  assetsDir + '/scripts/**/*.js'
];

gulp.task('lint', function () {
  return pipe(
    gulp.src(scripts),
    $.jscs(),
    $.jshint(),
    $.jshint.reporter('jshint-stylish'),
    $.jshint.reporter('fail')
  );
});

gulp.task('mocha', function () {
  return gulp.src('test/*.js', {read: false})
    .pipe($.mocha({reporter: 'spec'}))
    .once('end', function () {
      process.exit();
    });
});

gulp.task('styles', function () {
  return $.rubySass(assetsDir + '/styles/', {
    style: 'expanded',
    sourcemap: true
  })
  .on('error', function (err) {
    console.error('Error!', err.message);
  })
  .pipe($.autoprefixer())
  .pipe($.sourcemaps.write('./'))
  .pipe(gulp.dest(assetsDir + '/styles'));
});

gulp.task('watch', function () {
  gulp.watch(scripts, ['lint']);
  gulp.watch(assetsDir + '/styles/*.scss', ['styles']);
});

gulp.task('test', ['lint', 'mocha']);
gulp.task('build', ['styles']);
gulp.task('default', ['test', 'build']);
