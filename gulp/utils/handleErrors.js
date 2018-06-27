/**
* Send error to notification center
* Keep gulp from hanging on this task
*/

const $ = require('gulp-load-plugins')();

module.exports = function (error) {
    $.notify.onError({
        title: '<%= error.name %> 😵',
        message: '<%= error.message %>',
        sound: 'Funk'
    })(error);

    this.emit('end');
};
