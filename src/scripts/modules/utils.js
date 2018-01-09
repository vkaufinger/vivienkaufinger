(function (global) {
    var globName = 'myModule';

    /**
    * Utilitaries
    */
    var myModule = function () {
        var isMobile = require('ismobilejs');
        var Parallax = require('./smooth-scroll').Parallax;
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var offset = vh * 0.5;
        var smooth;
        var pre;


        // Preload all media on window load
        function deferLoading () {
            var players = document.querySelectorAll('.project__poster-player');

            window.addEventListener('load', () => {
                players.forEach((player) => {
                    player.setAttribute('poster', player.getAttribute('data-poster'));
                    player.removeAttribute('data-poster');

                    player.setAttribute('src', player.getAttribute('data-src'));
                    player.removeAttribute('data-src');
                });
            });
        }


        // Smooth scroll with parallaxed elements
        function parallaxInit () {
            var wrapper = document.getElementById('#main-wrapper');

            // Enable parallax only from desktop
            var parallaxEls = window.innerWidth < 1200 ? false : document.querySelectorAll('[data-speed]');

            smooth = new Parallax({
                extends: true,
                native: false,
                section: wrapper,
                divs: parallaxEls,
                ease: isMobile.any ? 0.1 : 0.075,
                vs: {
                    mouseMultiplier: 0.25,
                    touchMultiplier: 2.75
                }
            });

            // Expose smooth instance for blob module
            myModule.smooth = smooth;
        }


        function ready () {
            deferLoading();

            parallaxInit();
        }


        function resize () {
            smooth.resize();
        }


        function onScroll (direction, scrollY) {
            if (!smooth.options.divs) {
                return;
            }

            smooth.options.divs.forEach((el) => {
                if (!el.matches('.js-section')) {
                    return;
                }

                var items = el.querySelectorAll('.js-item');

                if (el.classList.contains('in-view')) {
                    var top = el.getBoundingClientRect().top;
                    var transform = (top - offset) / (vh - offset);
                    transform = Math.max(0, Math.min(transform, 1)).toFixed(2);

                    items.forEach((el) => {
                        el.style.transform = 'skewX(' + -25 * transform + 'deg) rotate(' + -25 * transform + 'deg)';
                    });
                }
            });
        }


        return {
            name: globName,
            ready: ready,
            resize: resize,
            onScroll: onScroll
        };
    }();

    /**
    * Context relative assignation
    */
    if (typeof module !== 'undefined') { module.exports = myModule; }
    else if (typeof define === 'function' && define.amd) { define(myModule); }
    else { global[globName] = myModule; }
})(window);
