(function (global) {
    var globName = 'myModule';

    /**
    * Utilitaries
    */
    var myModule = function () {
        var preloader = require('preloader');
        var Parallax = require('./smooth-scroll').Parallax;
        var vw = window.innerWidth;
        var vh = window.innerHeight;
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
                divs: parallaxEls,
                vs: {
                    mouseMultiplier: 0.25
                }
            });
            smooth.init();

            // Expose smooth instance for blob module
            myModule.smooth = smooth;
        }

        function toggleFooterLinks () {
            var footerLinks = document.querySelector('.js-footer');

            console.log(footerLinks);
            if (!footerLinks || vw < 768) {
                return;
            }

            var linksHeight = footerLinks.getBoundingClientRect().height;
            var lastScroll = 0;

            smooth.callback = function (scrollY) {
                var direction = lastScroll < scrollY ? 'down' : 'up';
                lastScroll = scrollY;

                if (direction === 'down') {
                    if (scrollY > vh - linksHeight) {
                        footerLinks.classList.add('is-dark');
                    } else {
                        footerLinks.classList.remove('is-dark');
                    }
                } else {
                    if (scrollY > vh) {
                        footerLinks.classList.add('is-dark');
                    } else {
                        footerLinks.classList.remove('is-dark');
                    }
                }
            };
        }


        function ready () {

            imagesPreload.init();

            parallaxInit();

            toggleFooterLinks();
        }


        function resize () {
            vw = window.innerWidth;
            vh = window.innerHeight;

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
