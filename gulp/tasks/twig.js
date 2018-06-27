'use strict';

const pkg = require('../../package.json');
const handleErrors = require('../utils/handleErrors.js');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

/**
* If staticSite option in enable:
* inject datas from data.json
* compile twig template
* beautify html output
*/
gulp.task('templates', () => {
    const datasPath = pkg.paths.datas + 'data.json';

    let datas;
    if ($.fs.existsSync(datasPath)) {
        datas = JSON.parse($.fs.readFileSync(datasPath));
    }

    return gulp
        .src('*.twig', { cwd: pkg.paths.src.templates })
        .pipe($.if(pkg.staticSite, $.twig({
            data: datas
        })))
        .on('error', handleErrors)
        .pipe($.if(pkg.staticSite, $.htmlBeautify()))
        .pipe($.if(pkg.staticSite, gulp.dest(pkg.paths.dist.base)))
        .pipe($.browserSync.stream())
    ;
});
