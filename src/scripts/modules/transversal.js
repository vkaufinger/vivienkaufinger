(function (global) {
    var globName = 'myModule';

    /**
    * Transversal
    */
    var myModule = function () {
        var TweenMax = require('gsap/src/uncompressed/TweenMax.js');
        let mouse = { x: 0, y: 0 };
        let iconLinks;


        function updateMousePosition () {
            window.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }, false);
        }


        function animateIcon () {
            const icon = this.querySelector('.icon-links__icon');
            const bounding = this.getBoundingClientRect();
            const moveX = mouse.x - bounding.left - (bounding.width * 0.5);
            const moveY = mouse.y - bounding.top - (bounding.height * 0.5);

            TweenMax.to(icon, 0.25, { x: moveX /2 + 'px', y: moveY /2 + 'px', ease:Linear.easeNone });
        }


        function attachEvents () {
            if (!iconLinks) {
                return;
            }

            iconLinks.forEach((link) => {

                link.addEventListener('mouseenter', (e) => {
                    TweenMax.ticker.addEventListener('tick', animateIcon, link);
                });

                link.addEventListener('mouseleave', (e) => {
                    TweenMax.ticker.removeEventListener('tick', animateIcon);

                    // Restore icon position
                    TweenMax.to(link.querySelector('.icon-links__icon'), 0.2, { x: 0, y: 0, clearProps: 'all' });
                });

            });
        }


        function iconLinksCursor () {
            iconLinks = document.querySelectorAll('.icon-links__link');

            updateMousePosition();

            attachEvents();
        }


        function ready () {
            iconLinksCursor();
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
