'use strict';

const handleSuccess = require('./gulp/utils/handleSuccess');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});
const tasks = $.fs.readdirSync('./gulp/tasks/');

/**
* Register all task files
*/
tasks.forEach((task) => {
    require('./gulp/tasks/' + task);
});

/**
* Build task
*/
gulp.task('build', gulp.series('clean', gulp.parallel('fontsCopy', 'imagesCopy', 'css', 'js', 'templates')));

/**
* Default task: build + watch + livereload
*/
gulp.task('default', gulp.series('build', gulp.parallel('watch', 'liveReload')));

/**
* Production task: build + optimization
*/
gulp.task('production', gulp.series('build', gulp.parallel('imagesOptim', 'cssOptim', 'jsOptim'), 'criticalPath', handleSuccess));
