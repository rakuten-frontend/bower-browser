'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var pipe = require('multipipe');
var runSequence = require('run-sequence');
var browserify = require('browserify');
var del = require('del');

var assetsDir = './client/assets';
var scripts = [
  './*.js',
  './lib/*.js',
  './test/*.js',
  assetsDir + '/scripts/**/*.js'
];

gulp.task('clean', function (callback) {
  del(['./lib/public'], callback);
});

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

gulp.task('scripts', function () {
  var bundler = browserify({
    entries: [assetsDir + '/scripts/app.js'],
    debug: true
  });
  return bundler.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./lib/public/assets/scripts'));
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
    .pipe(gulp.dest('./lib/public/assets/styles'));
});

gulp.task('bootstrap', function () {
  return gulp.src([
      './node_modules/bootstrap/**'
    ])
    .pipe(gulp.dest('./lib/public/node_modules/bootstrap'));
});

gulp.task('build', ['scripts', 'styles', 'bootstrap'], function () {
  return gulp.src([
      './client/**',
      '!./client/assets/scripts/**',
      '!./client/assets/styles/**'
    ])
    .pipe(gulp.dest('./lib/public'));
});

gulp.task('watch', function () {
  gulp.watch(scripts, ['lint']);
  gulp.watch(assetsDir + '/styles/*.scss', ['styles']);
});

gulp.task('test', ['clean'], function (callback) {
  runSequence('lint', 'build', 'mocha', callback);
});
gulp.task('default', ['test']);
