(function (global) {
    var globName = 'myModule';

    /**
    * Utilitaries
    */
    var myModule = function () {
        var isMobile = require('ismobilejs');
        var preloader = require('preloader');
        var Parallax = require('./smooth-scroll').Parallax;
        var loader = preloader({
            xhrImages: true,
            throttle: 1
        });
        var smooth;


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
            var wrapper = document.getElementById('#main-wrapper');
            var parallaxEls = document.querySelectorAll('[data-speed]');

            smooth = new Parallax({
                extends: true,
                native: false,
                section: wrapper,
                divs: isMobile.any ? false : parallaxEls, // Enable parallax only from tablet
                ease: isMobile.any ? 0.1 : 0.075,
                vs: {
                    mouseMultiplier: 0.25,
                    touchMultiplier: 2.75
                }
            });
            // Expose smooth instance for blob module
            myModule.smooth = smooth;

            // Init smooth on window load to fix bug calculation
            window.onload = function () {
                smooth.init();
            };
        }


        function ready () {
            imagesPreload.init();

            parallaxInit();
        }


        function resize () {
        }


        return {
            name: globName,
            ready: ready,
            resize: resize
        };
    }();

    /**
    * Context relative assignation
    */
    if (typeof module !== 'undefined') { module.exports = myModule; }
    else if (typeof define === 'function' && define.amd) { define(myModule); }
    else { global[globName] = myModule; }
})(window);
