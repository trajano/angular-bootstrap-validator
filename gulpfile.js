'use strict';
var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var minify = require('gulp-minify');
var esformatter = require('gulp-esformatter');
var es6transpiler = require('gulp-es6-transpiler');
var eslint = require('gulp-eslint');
var jsonFormat = require('gulp-json-format');

gulp.task('format-json', function(done) {
  return gulp.src('*.json').pipe(jsonFormat(4)).pipe(gulp.dest('.'));
});

gulp.task('format-js', function(done) {
  return gulp.src('lib/*.js').pipe(esformatter()).pipe(gulp.dest('lib'));
});

gulp.task('format-gulpfile', function(done) {
  return gulp.src('gulpfile.js').pipe(esformatter()).pipe(gulp.dest('dist'));
});

gulp.task('tidy', function(done) {
  gulp.run('format-json', 'format-js', 'format-gulpfile');
});

gulp.task('default', function(done) {
  return gulp.src('lib/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(ngAnnotate())
    .pipe(es6transpiler(
      {
        "globals": {
          "$": true,
          "angular": true
        }
      }
    ))
    .pipe(minify())
    .pipe(gulp.dest('dist'));
});
