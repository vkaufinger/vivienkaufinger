(function (global) {
    var globName = 'myModule';

    /**
    * Contact
    */
    var myModule = function () {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var offset = vh * 0.6;
        var smooth;


        function ready () {
            smooth = require('./utils.js').smooth;
        }


        function onScroll (direction, scrollY) {
            if (!smooth.options.divs) {
                return;
            }
            smooth.options.divs.forEach(function (el) {
                if (!el.matches('.js-list')) {
                    return;
                }

                var links = el.querySelectorAll('.js-list-item');

                if (el.classList.contains('in-view')) {
                    var top = el.getBoundingClientRect().top;
                    var transform = (top - offset) / (vh - offset);
                    transform = Math.max(0, Math.min(transform, 1));

                    links.forEach((el) => {
                        el.style.transform = 'skewX(' + -20 * transform + 'deg) rotate(' + -35 * transform + 'deg)';
                    });
                }
            });
        }


        function resize () {
            vw = window.innerWidth;
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
