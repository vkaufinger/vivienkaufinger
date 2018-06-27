'use strict';

const pkg = require('../../package.json');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

/**
* Watch files updates
*/
gulp.task('watch', () => {
    gulp.watch('**/*', { cwd: pkg.paths.src.fonts }, gulp.series('fontsCopy'));
    gulp.watch(['**/*', '!svg-icons/', '!svg-icons/**'], { cwd: pkg.paths.src.images }, gulp.series('imagesCopy'));
    gulp.watch('svg-icons/*', { cwd: pkg.paths.src.images }, gulp.series('css'));
    gulp.watch('**/*.scss', { cwd: pkg.paths.src.styles }, gulp.series('css'));
    gulp.watch('**/*.js', { cwd: pkg.paths.src.scripts }, gulp.series('js'));
    gulp.watch('**/*.twig', { cwd: pkg.paths.src.templates }, gulp.series('templates'));

    if (pkg.staticSite) {
        gulp.watch('*.json', { cwd: pkg.paths.datas }, gulp.series('templates'));
    }
});

/**
* Use Browsersync for live reload
*/

gulp.task('liveReload', () => {
    $.browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});
