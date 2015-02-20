'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var pipe = require('multipipe');
var runSequence = require('run-sequence');
var browserify = require('browserify');
var watchify = require('watchify');
var del = require('del');
var minimist = require('minimist');

var knownOptions = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'production'
  }
};
var options = minimist(process.argv.slice(2), knownOptions);

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

function buildScripts(watch) {
  var baseArgs = {
    entries: [assetsDir + '/scripts/app.js'],
    debug: true
  };
  var bundler = watch ? watchify(browserify(baseArgs, watchify.args)) : browserify(baseArgs);
  var bundle = function () {
    return bundler.bundle()
      .on('error', function (error) {
        $.util.log($.util.colors.red('Browserify error:') + '\n' + error.message);
      })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.if(options.env === 'production', $.uglify()))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('./lib/public/assets/scripts'));
  };
  if (watch) {
    bundler
      .on('update', bundle)
      .on('log', function (message) {
        $.util.log('Browserify log:\n' + message);
      });
  }
  return bundle();
}

gulp.task('scripts', function () {
  return buildScripts();
});

gulp.task('styles', function () {
  return $.rubySass(assetsDir + '/styles/', {
      loadPath: './node_modules',
      style: 'expanded',
      sourcemap: true
    })
    .on('error', function (error) {
      $.util.log($.util.colors.red('Sass error:') + '\n' + error.message);
    })
    .pipe($.autoprefixer())
    .pipe($.if(options.env === 'production', $.minifyCss({keepSpecialComments: 0})))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./lib/public/assets/styles'));
});

gulp.task('fonts', function () {
  return gulp.src([
      './node_modules/bootstrap-sass/assets/fonts/bootstrap/*'
    ])
    .pipe(gulp.dest('./lib/public/assets/fonts'));
});

gulp.task('build', ['scripts', 'styles', 'fonts'], function () {
  return gulp.src([
      './client/**',
      '!./client/assets/scripts/**',
      '!./client/assets/styles/**'
    ])
    .pipe(gulp.dest('./lib/public'));
});

gulp.task('watch', function () {
  options.env = 'development';
  gulp.watch(scripts, ['lint']);
  gulp.watch(assetsDir + '/styles/*.scss', ['styles']);
  buildScripts(true);
});

gulp.task('test', ['clean'], function (callback) {
  runSequence('lint', 'build', 'mocha', callback);
});

gulp.task('default', ['test']);
