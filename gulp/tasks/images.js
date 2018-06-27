'use strict';

const pkg = require('../../package.json');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

/**
* Copy all images except svg-icons/
*/
gulp.task('imagesCopy', () => {
    return gulp
        .src(['**/*', '!svg-icons/', '!svg-icons/**'], { cwd: pkg.paths.src.images })
        .pipe($.changed(pkg.paths.dist.images))
        .pipe(gulp.dest(pkg.paths.dist.images))
        .pipe($.browserSync.stream())
    ;
});

/**
* Minify images
*/
gulp.task('imagesOptim', () => {
    return gulp
        .src('**/*', { cwd: pkg.paths.dist.images })
        .pipe($.imagemin({
            interlaced: true,
            progressive: true,
            verbose: true
        }))
        .pipe(gulp.dest(pkg.paths.dist.images))
    ;
});
