'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const fs = require('fs');
const stylish = require('jshint-stylish');

const paths = {
    src: __dirname + '/src/',
    dist: __dirname + '/dist/'
};

const plumberErrorHandler = {
    errorHandler: function (err) {
        $.notify.onError({
            title: typeof(err.plugin) !== 'undefined' ? 'Gulp error in <%= error.plugin %>' : null,
            message: '<%= error.message %>',
            sound: 'Funk'
        })(err);
        this.emit('end');
    }
};

var env;


/**
* CLEAN
*/
gulp.task('clean', function () {
    del.sync([paths.dist + '*', './*.html']);
});


/**
* IMAGES
*/

//Copy images in dist directory
gulp.task('imgCopy', function () {
    return gulp
        .src(['**/*', '!svg-icons', '!svg-icons/*'], { cwd: paths.src + 'images/' })
        .pipe(gulp.dest('images', { cwd: paths.dist }))
        .pipe($.livereload())
    ;
});


//Generate svg sprite
gulp.task('imgSvg', function () {
    return gulp
        .src('*.svg', { cwd: paths.src + 'images/svg-icons/' })
        .pipe($.svgmin({
            plugins: [
                {
                    cleanupIDs: {
                        remove: true,
                        minify: true
                    }
                }, {
                    removeTitle: true
                }
            ]
        }))
        .pipe($.svgstore({
            inlineSvg: true
        }))
        .pipe($.rename('svg-icons.twig'))
        .pipe(gulp.dest('images', { cwd: paths.dist }))
        .pipe($.livereload())
    ;
});
gulp.task('images', ['imgCopy']);


/**
* JS
*/

//Check synthax of all modules
gulp.task('jsHint', function () {
    return gulp
        .src('**/*.js', { cwd: paths.src + 'scripts/' })
        .pipe($.jshint({
            esversion: 6,
            expr: true,
            boss: true,
        }))
        .pipe($.jshint.reporter(stylish))
    ;
});

//Browserify + minify main js file
gulp.task('jsModules', ['jsHint'], function () {
    return gulp
        .src('*.js', { cwd: paths.src + 'scripts/' })
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.browserify2())
        .pipe($.if(env !== 'dev', $.uglifyEs.default({
            mangle: {
                reserved: ['Smooth']
            }
        })))
        .pipe($.rename('main.min.js'))
        .pipe(gulp.dest('scripts', { cwd: paths.dist }))
        .pipe($.livereload())
    ;
});
gulp.task('js', ['jsModules']);


/**
* STYLES
*/

//Copy fonts
gulp.task('fontCopy', function () {
    return gulp
        .src('**/*', { cwd: paths.src + 'fonts/' })
        .pipe(gulp.dest('fonts', { cwd: paths.dist }))
        .pipe($.livereload())
    ;
});

//Compile sass + autroprefixer + merge media queries
gulp.task('css', function () {
    return gulp
        .src('*.scss', { cwd: paths.src + 'styles/' })
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.sass())
        .pipe($.autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe($.csso({
            comments: false,
            forceMediaMerge: true
        }))
        .pipe(gulp.dest('styles', { cwd: paths.dist }))
        .pipe($.livereload())
    ;
});

gulp.task('styles', ['fontCopy', 'css']);

//TWIG
gulp.task('twig', ['styles', 'imgSvg'], function () {
    return gulp
		.src(['*.twig'], { cwd: paths.src + 'twig' })
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.twig({
            errorLogToConsole: false,
            data: {
                data: JSON.parse(fs.readFileSync('./datas/data.json'))
            }
        }))
        .pipe(gulp.dest('.'))
        .pipe($.livereload())
    ;
});

// Compile twig + inject css
gulp.task('templating', ['twig'], function () {
    return gulp
        .src('./*.html')
        .pipe($.injectCss())
        .pipe(gulp.dest('.'))
    ;
});


/**
* BUILD
*/
gulp.task('build', ['clean', 'images', 'js', 'styles', 'templating']);

gulp.task('default', ['build'], function () {
    $.notify({
        message : 'Compile is succeed :-)',
        sound: 'Glass'
    })
    .write('');
});

//WATCH FILES BY TYPE
gulp.task('watch', ['build'], function () {
    env = 'dev';
    // Images
    gulp.watch(['**/*', '!svg-icons', '!svg-icons/*'], { cwd: paths.src + 'images/' }, ['imgCopy']);
    gulp.watch('*.svg', { cwd: paths.src + 'images/svg-icons' }, ['templating']);
    // Fonts
    gulp.watch('**/*', { cwd: paths.src + 'fonts/' }, [ 'fontCopy' ]);
    // CSS
    gulp.watch('**/*', { cwd: paths.src + 'styles/' }, [ 'templating' ]);
    // JS
    gulp.watch('**/*', { cwd: paths.src + 'scripts/modules/' }, [ 'js' ]);
    // Twig
    gulp.watch('**/*', { cwd: 'datas/' }, [ 'templating' ]);
    gulp.watch('**/*', { cwd: paths.src + 'twig/' }, [ 'templating' ]);
    $.livereload({ start: true });
});

gulp.task('w', ['watch']);
