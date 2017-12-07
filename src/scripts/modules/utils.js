(function (global) {
    var globName = 'myModule';

    /**
    * Utilitaries
    */
    var myModule = function () {
        var FontFaceObserver = require('fontfaceobserver');
        var preloader = require('preloader');
        var html = document.documentElement;
        var loader = preloader({
            xhrImages: true,
            throttle: 1
        });


        // Observe fonts loading before use it to don't block the rendering
        function fontLoading () {
            var font = new FontFaceObserver('League Spartan');
            font.load().then(function () {
                html.classList.add('fonts-loaded');
            });
        }


        // Preload all images on window load
        var imagesPreload = {
            srcSet: function () {
                loader.urls.forEach(function (url) {
                    var img = document.querySelector('img[data-src="' + url + '"]');
                    if (img) {
                        img.setAttribute('src', loader.get(url).src);
                        img.removeAttribute('data-src');
                    }
                });
            },
            progress: function (progress) {
                // console.log(progress)
            },
            init: function () {
                imagesToLoad.forEach(function (url) {
                    loader.addImage(url);
                });

                loader.on('progress', imagesPreload.progress);

                loader.on('complete', imagesPreload.srcSet);

                loader.load();
            }
        };


        function ready () {
            fontLoading();

            imagesPreload.init();
        }


        function ajaxComplete () {
            imagesPreload.srcSet();
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
