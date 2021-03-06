(function (global) {
    var globName = 'myModule';

    /**
    * Utilitaries
    */
    var myModule = function () {
        var Parallax = require('./smooth-scroll').Parallax;
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var offset = vh * 0.25;
        var smooth;

        // Preload all media on window load
        function deferLoading () {
            var players = document.querySelectorAll('.project__poster-player');

            window.addEventListener('load', () => {
                players.forEach((player) => {
                    player.setAttribute('poster', player.getAttribute('data-poster'));
                    player.removeAttribute('data-poster');

                    // Disable video loading on tablet and mobile layout
                    if (vw < 1200) {
                        return;
                    }
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
                vs: {
                    mouseMultiplier: navigator.platform === 'MacIntel' ? 0.25 : 1,
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


        function onScroll () {
            if (!smooth.options.divs) {
                return;
            }

            smooth.options.divs.forEach((div) => {
                if (!div.matches('.js-section')) {
                    return;
                }

                var items = div.querySelectorAll('.js-item');

                if (div.classList.contains('in-view')) {
                    var top = div.getBoundingClientRect().top;
                    var transform = (top - offset) / (vh - offset);
                    transform = Math.max(0, Math.min(transform, 1));

                    items.forEach((el) => {
                        el.style.transform = 'skewX(' + -25 * transform + 'deg) rotate(' + -25 * transform + 'deg)';
                    });
                }
            });
        }


        return {
            name: globName,
            ready: ready,
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
