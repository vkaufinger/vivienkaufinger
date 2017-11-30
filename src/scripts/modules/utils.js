(function (global) {
    var globName = 'myModule';

    /**
    * Utilitaries
    */
    var myModule = function () {
        var FontFaceObserver = require('fontfaceobserver');
        var html = document.documentElement;

        function fontLoading () {
            var font = new FontFaceObserver('League Spartan');
            font.load().then(function () {
                html.classList.add('fonts-loaded');
            });
        }

        function ready () {
            fontLoading();
        }

        return {
            name: globName,
            ready: ready
        };
    }();

    /**
    * Context relative assignation
    */
    if (typeof module !== 'undefined') { module.exports = myModule; }
    else if (typeof define === 'function' && define.amd) { define(myModule); }
    else { global[globName] = myModule; }
})(window);
