/**
* Send success to notification center
*/

const $ = require('gulp-load-plugins')();

module.exports = function (done) {
    $.notify({
        message : 'Compile is succeed 🙂',
        sound: 'Glass'
    }).write('', done);
};
