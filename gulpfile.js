'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var pipe = require('multipipe');
var runSequence = require('run-sequence');
var browserify = require('browserify');
var brfs = require('brfs');
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

var paths = {
  src: './client',
  dest: './lib/public',
  scripts: [
    './*.js',
    './lib/*.js',
    './test/*.js',
    './client/assets/scripts/**/*.js'
  ],
  styles: [
    './client/assets/styles/*.scss'
  ],
  html: [
    './client/*.html'
  ]
};

gulp.task('clean', function (callback) {
  del(paths.dest, callback);
});

gulp.task('lint', function () {
  return pipe(
    gulp.src(paths.scripts),
    $.jscs(),
    $.jshint(),
    $.jshint.reporter('jshint-stylish'),
    $.jshint.reporter('fail')
  );
});

gulp.task('mocha', function () {
  return gulp.src('test/*-test.js', {read: false})
    .pipe($.mocha({reporter: 'spec'}))
    .once('end', function () {
      process.exit();
    });
});

function buildScripts(watch) {
  var baseArgs = {
    entries: [paths.src + '/assets/scripts/app.js'],
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
      .pipe(gulp.dest(paths.dest + '/assets/scripts'));
  };
  bundler.transform(brfs);
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

gulp.task('scripts:watch', function () {
  return buildScripts(true);
});

gulp.task('styles', function () {
  return $.rubySass(paths.src + '/assets/styles/', {
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
    .pipe(gulp.dest(paths.dest + '/assets/styles'));
});

gulp.task('fonts', function () {
  return gulp.src([
      './node_modules/bootstrap-sass/assets/fonts/bootstrap/*'
    ])
    .pipe(gulp.dest(paths.dest + '/assets/fonts'));
});

gulp.task('html', function () {
  return gulp.src(paths.html)
    .pipe($.if(options.env === 'production', $.useref()))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('nodemon', function () {
  return $.nodemon({
    script: './test/server.js',
    ignore: [paths.src, paths.dest]
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['lint']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.html, ['html']);
  gulp.watch([
      '*.html',
      'assets/scripts/**/*.js',
      'assets/styles/*.css',
      'assets/fonts/*'
    ], {
      cwd: paths.dest
    })
    .on('change', $.livereload.changed);
});

gulp.task('serve', ['clean'], function (callback) {
  options.env = 'development';
  $.livereload.listen();
  runSequence(['scripts:watch', 'styles', 'fonts', 'html'], 'nodemon', 'watch', callback);
});

gulp.task('build', ['scripts', 'styles', 'fonts', 'html']);

gulp.task('test', ['clean'], function (callback) {
  runSequence('lint', 'build', 'mocha', callback);
});

gulp.task('default', ['test']);
