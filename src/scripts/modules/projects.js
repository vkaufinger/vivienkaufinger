(function (global) {
    var globName = 'myModule';

    /**
    * Projects
    */
    var myModule = function () {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var offset = vh * 0;
        var projects;


        function ready () {
            projects = document.querySelectorAll('.project');
        }


        function onScroll (direction, scrollY) {
            projects.forEach(function (el) {
                var poster = el.querySelector('.project__poster-inner');
                if (!poster) {
                    return;
                }
                var top = el.getBoundingClientRect().top - offset;
                var inView = top <= vh;
                if (inView) {
                    var transform = top / vh;
                    transform = Math.max(transform, 0);
                    transform = 1 - transform;

                    poster.style.transform = 'rotateX(' + -55 * transform + 'deg) rotateZ(' + 45 * transform + 'deg)';
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
