'use strict';

const pkg = require('../../package.json');
const handleErrors = require('../utils/handleErrors.js');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

/**
* Extract and inject critical style in html
*/
gulp.task('criticalPath', (done) => {
    if (pkg.staticSite) {
        $.critical.generate({
            inline: true,
            base: pkg.paths.dist.base,
            src: 'index.html',
            dest: 'index.html',
            minify: true
        });
    }

    done();
});
