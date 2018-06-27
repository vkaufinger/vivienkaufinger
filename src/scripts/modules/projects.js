(function (global) {
    var globName = 'myModule';

    /**
    * Projects
    */
    var myModule = function () {
        var vh = window.innerHeight;
        var offset = vh * 0.35;
        var smooth;


        function ready () {
            smooth = require('./utils.js').smooth;
        }


        // Toggle play belong if player is in or off viewport
        function togglePlay (element) {
            if (!element.matches('.project__poster')) {
                return;
            }

            const player = element.querySelector('.project__poster-player');

            if (element.classList.contains('in-view')) {
                if (player.status !== 'playing') {
                    player.play();
                    player.status = 'playing';
                }
            } else {
                if (player.status === 'playing') {
                    player.pause();
                    player.status = 'paused';
                }
            }
        }


        // Anime poster with scroll level
        function posterAnim (element) {
            if (!element.matches('.project__poster')) {
                return;
            }

            const poster = element;

            if (poster.classList.contains('in-view')) {
                var top = poster.getBoundingClientRect().top;
                var transform = (top - offset) / (vh - offset);
                transform = Math.max(0, Math.min(1 - transform, 1));

                poster.querySelector('.project__poster-inner').style.transform = 'rotateX(' + -55 * transform + 'deg) rotateZ(' + 45 * transform + 'deg)';
            }
        }


        function onScroll () {
            if (!smooth.options.divs) {
                return;
            }
            smooth.options.divs.forEach((el) => {
                togglePlay(el);

                posterAnim(el);
            });
        }


        function resize () {
            vh = window.innerHeight;
        }


        return {
            name: globName,
            ready: ready,
            onScroll: onScroll,
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
