'use strict';

const pkg = require('../../package.json');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

/**
* Clean dist folder and remove all assets
*/
gulp.task('clean', () => {
    return gulp
        .src(pkg.paths.dist.base, { allowEmpty: true, read: false })
        .pipe($.clean())
    ;
});
