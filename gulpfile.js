/**
 * Gulp file
 *
 * Targets
 * <dl>
 *     <dt>tidy</dt>
 *     <dd>Reformats code</dd>
 *     <dt>lint</dt>
 *     <dd>Performs ESLint checks on the code to make sure we are following best practice.</dd>
 *     <dt>default</dt>
 *     <dd>Calls lint and then transpiles the code to the required forms</dd>
 */
'use strict'
var gulp = require('gulp')

var babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  eol = require('gulp-eol'),
  esFormatter = require('gulp-esformatter'),
  esLint = require('gulp-eslint'),
  iife = require('gulp-iife'),
  jsonFormat = require('gulp-json-format'),
  ngAnnotate = require('gulp-ng-annotate'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify')

/**
 * ESFormatter options
 */
var esFormatterOptions = {
  plugins: [
    'esformatter-asi',
    'esformatter-quotes',
    'esformatter-quote-props',
    'esformatter-remove-trailing-commas'
  ],
  quotes: {
    type: 'single'
  }
}

var srcs = ['src/*.js', 'src/**/*.js']

gulp.task('format-json', function() {
  return gulp.src(['package.json', '*.json'])
    .pipe(jsonFormat(2))
    .pipe(eol())
    .pipe(gulp.dest('.'))
})

gulp.task('format-js', function() {
  return gulp.src(srcs)
    .pipe(esFormatter(esFormatterOptions))
    .pipe(eol())
    .pipe(gulp.dest('src'))
})

gulp.task('format-build-js', function() {
  return gulp.src(['gulpfile.js', 'package.js'])
    .pipe(esFormatter(esFormatterOptions))
    .pipe(eol())
    .pipe(gulp.dest('.'))
})

gulp.task('tidy', ['format-json', 'format-js', 'format-build-js'], function() {})

gulp.task('lint', function() {
  return gulp.src(srcs)
    .pipe(esLint())
    .pipe(esLint.format())
    .pipe(esLint.failAfterError())
})

gulp.task('default', ['lint'], function() {
  return gulp.src(srcs)
    .pipe(sourcemaps.init())
    .pipe(iife())
    .pipe(concat('angular-bootstrap-validator.js'))
    .pipe(ngAnnotate())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.'))
})
