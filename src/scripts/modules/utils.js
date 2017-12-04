(function (global) {
    var globName = 'myModule';

    /**
    * Utilitaries
    */
    var myModule = function () {
        var FontFaceObserver = require('fontfaceobserver');
        var preload = require('preload.js');
        var html = document.documentElement;


        // Observe fonts loading before use it to don't block the rendering
        function fontLoading () {
            var font = new FontFaceObserver('League Spartan');
            font.load().then(function () {
                html.classList.add('fonts-loaded');
            });
        }


        // Preload all images on window load
        var imagesLoading = {
            srcSet: function () {
               document.querySelectorAll('img[data-src]').forEach(function (image) {
                    image.setAttribute('src', image.getAttribute('data-src'));
                    image.removeAttribute('data-src');
                });
            },
            init: function () {
                var that = this;
                preload(imagesToLoad).progress(function (percent, image) {
                    if (percent === 100) {
                        that.srcSet();
                    }
                    console.log(percent, image);
                });
            }
        };


        function ready () {
            fontLoading();

            window.addEventListener('load', function () {
                imagesLoading.init();
            });
        }


        function ajaxComplete () {
            imagesLoading.srcSet();
        }

        return {
            name: globName,
            ready: ready,
            ajaxComplete: ajaxComplete
        };
    }();

    /**
    * Context relative assignation
    */
    if (typeof module !== 'undefined') { module.exports = myModule; }
    else if (typeof define === 'function' && define.amd) { define(myModule); }
    else { global[globName] = myModule; }
})(window);
