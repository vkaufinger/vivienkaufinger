'use strict';

const pkg = require('../../package.json');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

/**
* Copy all fonts files
*/
gulp.task('fontsCopy', () => {
    return gulp
        .src('**/*', { cwd: pkg.paths.src.fonts })
        .pipe($.changed(pkg.paths.dist.fonts))
        .pipe(gulp.dest(pkg.paths.dist.fonts))
        .pipe($.browserSync.stream())
    ;
});
