(function (global) {
    var globName = 'myModule';

    /**
    * Utilitaries
    */
    var myModule = function () {
        var FontFaceObserver = require('fontfaceobserver');
        var preloader = require('preloader');
        var Parallax = require('./smooth-scroll').Parallax;
        var html = document.documentElement;
        var loader = preloader({
            xhrImages: true,
            throttle: 1
        });
        var smooth;


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
                        // Refresh scroll
                        smooth.resize();
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


        // Smooth scroll with parallaxed elements
        function parallaxInit () {
            smooth = new Parallax({
                extends: true,
                native: false,
                section: document.getElementById('#ajax-wrapper'),
                divs: document.querySelectorAll('.vs-div'),
                vs: {
                    mouseMultiplier: 0.25
                }
            });
            smooth.init();

            // Expose smooth instance for blob module
            myModule.smooth = smooth;
        }


        function ready () {
            imagesPreload.init();

            parallaxInit();
        }


        return {
            name: globName,
            ready: ready,
        };
    }();

    /**
    * Context relative assignation
    */
    if (typeof module !== 'undefined') { module.exports = myModule; }
    else if (typeof define === 'function' && define.amd) { define(myModule); }
    else { global[globName] = myModule; }
})(window);
