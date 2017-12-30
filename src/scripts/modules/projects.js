(function (global) {
    var globName = 'myModule';

    /**
    * Projects
    */
    var myModule = function () {
        var smooth;
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var offset = vh * 0.35;


        function ready () {
            smooth = require('./utils.js').smooth;
        }


        function onScroll (direction, scrollY) {
            if (!smooth.options.divs) {
                return;
            }
            smooth.options.divs.forEach(function (el) {
                if (!el.matches('.project__poster')) {
                    return;
                }

                var top = el.getBoundingClientRect().top;
                var transform = (top - offset) / (vh - offset);
                transform = 1 - Math.max(transform, 0);

                if (el.classList.contains('in-view')) {
                    el.style.transform = 'rotateX(' + -55 * transform + 'deg) rotateZ(' + 45 * transform + 'deg)';
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
