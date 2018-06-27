'use strict';

const pkg = require('../../package.json');
const handleErrors = require('../utils/handleErrors.js');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

/**
* Check js syntax
*/
gulp.task('jsLint', () => {
    return gulp
        .src('**/*.js', { cwd: pkg.paths.src.scripts, allowEmpty: true })
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
        .on('error', handleErrors)
    ;
});

/**
* Browserify js modules
* Transpile modules and selected node_modules with babel
*/
gulp.task('jsCompile', () => {
    return gulp
        .src('main.js', { cwd: pkg.paths.src.scripts, allowEmpty: true })
        .pipe($.bro({
            debug: true,
            error: 'emit',
            transform: [["babelify", {
                "global": true,
                "ignore": /\/node_modules\/(?!bubble-event\/)/,
                "presets": [$.babelPresetEnv]
            }]]
        }))
        .on('error', handleErrors)
        .pipe(gulp.dest(pkg.paths.dist.base))
        .pipe($.browserSync.stream())
    ;
});

gulp.task('js', gulp.parallel('jsLint', 'jsCompile'));

/**
* Minify js
*/
gulp.task('jsOptim', () => {
    return gulp
        .src('main.js', { cwd: pkg.paths.dist.base })
        .pipe($.uglify({
            mangle: true
        }))
        .pipe(gulp.dest(pkg.paths.dist.base))
    ;
});

