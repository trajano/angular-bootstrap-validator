'use strict';
var gulp = require('gulp');

var babel = require('gulp-babel');
var esformatter = require('gulp-esformatter');
var eslint = require('gulp-eslint');
var jsonFormat = require('gulp-json-format');
var minify = require('gulp-minify');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('format-json', function(done) {
  return gulp.src('*.json').pipe(jsonFormat(4)).pipe(gulp.dest('.'));
});

gulp.task('format-js', function(done) {
  return gulp.src('lib/*.js').pipe(esformatter()).pipe(gulp.dest('lib'));
});

gulp.task('format-gulpfile', function(done) {
  return gulp.src('gulpfile.js').pipe(esformatter()).pipe(gulp.dest('dist'));
});

gulp.task('tidy', ['format-json', 'format-js', 'format-gulpfile'], function(done) {});

gulp.task('default', function(done) {
  return gulp.src('lib/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(ngAnnotate())
    .pipe(babel({
      presets: ['es2015']
    })).pipe(minify())
    .pipe(gulp.dest('dist'));
});
