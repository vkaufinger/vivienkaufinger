'use strict';

const gulp     = require('gulp');
const $        = require('gulp-load-plugins')();
const argv     = require('yargs').argv;
const stylish  = require('jshint-stylish');
const fs       = require('fs');
const critical = require('critical').stream;

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


/**
* CLEAN FOLDERS
*/
gulp.task('clean', () => {
    return gulp
        .src([paths.dist + '*', '*.html'], { read: false })
        .pipe($.clean())
    ;
});


/**
* IMAGES
*/

// Copy static images in dist directory
function imgCopy () {
    return gulp
        .src(['**/*', '!svg-icons', '!svg-icons/*'], { cwd: paths.src + 'images/' })
        .pipe(gulp.dest('images', { cwd: paths.dist }))
        .pipe($.livereload())
    ;
}

// Generate svg sprite
function svgSprite () {
    return gulp
        .src('*.svg', { cwd: paths.src + 'images/svg-icons/' })
        .pipe($.svgmin({
            plugins: [
                {
                    cleanupIDs: {
                        remove: true,
                        minify: true
                    }
                },
                { removeTitle: true }
            ]
        }))
        .pipe($.svgstore({
            inlineSvg: true
        }))
        .pipe($.rename('svg-sprite.twig'))
        .pipe(gulp.dest('images', { cwd: paths.dist }))
        .pipe($.livereload())
    ;
}

gulp.task('images', gulp.parallel(imgCopy, svgSprite));


/**
* TEMPLATING
*/
function twig () {
    return gulp
        .src('*.twig', { cwd: paths.src + 'twig' })
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.twig({
            errorLogToConsole: false,
            data: {
                data: JSON.parse(fs.readFileSync('./datas/data.json'))
            }
        }))
        .pipe($.htmlBeautify())
        .pipe(gulp.dest('.'))
        .pipe($.livereload())
    ;
}

gulp.task('templating', gulp.series(twig));


/**
* SCRIPTS
*/

// Check synthax of all modules
function jsHint () {
    return gulp
        .src('**/*.js', { cwd: paths.src + 'scripts/' })
        .pipe($.jshint({
            esversion: 6,
            expr: true,
            boss: true,
        }))
        .pipe($.jshint.reporter(stylish))
    ;
}

// Browserify + minify main js file
function jsModules () {
    return gulp
        .src('*.js', { cwd: paths.src + 'scripts/' })
        .pipe($.plumber(plumberErrorHandler))
        .pipe($.browserify2())
        .pipe($.if(argv.prod, $.uglifyes({
            mangle: {
                reserved: ['Smooth']
            }
        })))
        .pipe($.rename('main.min.js'))
        .pipe(gulp.dest('scripts', { cwd: paths.dist }))
        .pipe($.livereload())
    ;
}

gulp.task('js', gulp.series(jsHint, jsModules))


/**
* STYLES
*/

// Copy fonts in dist directory
function fontCopy () {
    return gulp
        .src('**/*', { cwd: paths.src + 'fonts/' })
        .pipe(gulp.dest('fonts', { cwd: paths.dist }))
        .pipe($.livereload())
    ;
}

// Compile sass + autoprefixer + merge media queries + minify css
function css () {
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
        .pipe($.rename('main.min.css'))
        .pipe($.if(argv.prod, $.uncss({
            html: ['*.html'],
            ignore: [
                new RegExp('^\.vs-.*'),
                new RegExp('^\.is-.*')

            ]
        })))
        .pipe(gulp.dest('styles', { cwd: paths.dist }))
        .pipe($.livereload())
    ;
}

gulp.task('styles', gulp.parallel(fontCopy, css));


function criticalPath () {
    return gulp
        .src('*.html')
        .pipe(critical({
            inline: true,
            css: ['dist/styles/main.min.css']
        }))
        .pipe(gulp.dest('.'))
    ;
}


/**
* BUILD
*/

function completeBuild (done) {
    $.notify({
        message : 'Compile is succeed :-)',
        sound: 'Glass'
    })
    .write('', done);
}

gulp.task('default', gulp.series('clean', 'images', 'templating', gulp.parallel('js', 'styles'), criticalPath, completeBuild));


/**
* WATCH FILES BY TYPE
*/
function watch () {
    gulp.watch('**/*.scss', { cwd: paths.src + 'styles/' },          gulp.series(css));
    gulp.watch('**/*.js',   { cwd: paths.src + 'scripts/modules/' }, gulp.series('js'));
    gulp.watch('**/*',      { cwd: paths.src + 'images/' },          gulp.series('images'));
    gulp.watch('**/*',      { cwd: paths.src + 'fonts/' },           gulp.series(fontCopy));
    gulp.watch('**/*.twig', { cwd: paths.src + 'twig/' },            gulp.series('templating'));
    $.livereload({ start: true });
}
gulp.task('w', gulp.series('clean', 'images', 'templating', gulp.parallel('js', 'styles'), watch));
