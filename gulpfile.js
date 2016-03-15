'use strict';
var mainjs = ['angular-bootstrap-validator.js'];
var gulp = require('gulp');

var babel = require('gulp-babel'),
  eol = require('gulp-eol'),
  esFormatter = require('gulp-esformatter'),
  esLint = require('gulp-eslint'),
  jsonFormat = require('gulp-json-format'),
  minify = require('gulp-minify'),
  ngAnnotate = require('gulp-ng-annotate');

gulp.task('format-json', function() {
  return gulp.src(['package.json', '*.json'])
    .pipe(jsonFormat(2))
    .pipe(eol())
    .pipe(gulp.dest('.'));
});

gulp.task('format-js', function() {
  return gulp.src('*.js')
    .pipe(esFormatter())
    .pipe(eol())
    .pipe(gulp.dest('.'));
});

gulp.task('tidy', ['format-json', 'format-js'], function() {});

gulp.task('lint', function() {
  return gulp.src(mainjs)
    .pipe(esLint({
      useEslintrc: false,
      "parserOptions": {
        "ecmaVersion": 6
      },
      "plugins": [
        "angular"
      ],
      "extends": ["eslint:recommended", "angular"],
      "envs": ["angular/angular"],
      "rules": {
        'angular/angularelement': 0
      },
      "globals": {
        '$': true
      }
    }))
    .pipe(esLint.format())
    .pipe(esLint.failAfterError());
});

gulp.task('default', ['lint'], function() {
  return gulp.src(mainjs)
    .pipe(ngAnnotate())
    .pipe(babel({
      presets: ['es2015']
    })).pipe(minify())
    .pipe(gulp.dest('dist'));
});
