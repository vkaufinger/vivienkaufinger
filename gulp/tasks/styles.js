'use strict';

const pkg = require('../../package.json');
const handleErrors = require('../utils/handleErrors.js');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

/**
* Compile sass
* Use postCSS for autoprefixer and svg b64 inline
* Write source maps
*/
gulp.task('css', () => {
    const plugins = [
        $.autoprefixer({
            browsers: ['last 2 version'],
        }),
        $.postcssInlineSvg(),
        $.postcssSvgo()
    ];

    return gulp
        .src('main.scss', { cwd: pkg.paths.src.styles, allowEmpty: true })
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            includePaths: 'node_modules'
        }).on('error', handleErrors))
        .pipe($.postcss(plugins).on('error', handleErrors))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(pkg.paths.dist.base))
        .pipe($.browserSync.stream())
    ;
});

/**
* Use postCSS to minify css
* If staticSite option is enable unCSS from html files
*/
gulp.task('cssOptim', () => {
    const plugins = [
        $.postcssCsso({
            comments: false,
            forceMediaMerge: true
        })
    ];

    return gulp
        .src('main.css', { cwd: pkg.paths.dist.base })
        .pipe($.postcss(plugins).on('error', handleErrors))
        .pipe($.if(pkg.static, $.uncss({
            html: [pkg.paths.dist.base + '*.html']
        })))
        .pipe(gulp.dest(pkg.paths.dist.base))
    ;
});
