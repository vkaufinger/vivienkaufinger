(function (global) {
    var globName = 'myModule';

    /**
    * Experiences
    */
    var myModule = function () {
        var TweenMax = require('gsap/src/uncompressed/TweenMax.js');
        var mouse = { x: 0, y: 0 };
        var pos = { x: 0, y: 0 };
        const ease = 0.1;


        function applyCursorEasing () {
            pos.x += (mouse.x - pos.x) * ease;
            pos.y += (mouse.y - pos.y) * ease;
        }


        function updateCursorPosition () {
            // Update mouse position on mousemove
            window.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            });

            // Ticker apply an easing on mouse position with RAF
            TweenMax.ticker.addEventListener('tick', applyCursorEasing);
        }


        function revealBlobs (blobs) {
            TweenMax.to(blobs, 0.25, { y: 0, opacity: 1, scale: 1 });
        }


        function hideBlobs (blobs) {
            TweenMax.to(blobs, 0.25, { scale: 0.75, opacity: 0, clearProps: 'all' });
        }


        function moveBlobs (blob, speed) {
            const bounding = blob.getBoundingClientRect();
            const posX = pos.x - bounding.left - (bounding.width * 0.5);
            const posY = pos.y - bounding.top - (bounding.height * 0.5);

            TweenMax.to(blob, speed, { x: posX + 'px', y: posY + 'px' });
        }


        function animateBlobs () {
            var blobs = this.querySelectorAll('.list__icon');

            revealBlobs(blobs);

            moveBlobs(blobs[0], 1.25);
            moveBlobs(blobs[1], 0.25);
        }


        function cursorBlobs () {
            var links = document.querySelectorAll('.js-list-link');

            if (!links) {
                return;
            }

            updateCursorPosition();

            links.forEach((link) => {

                link.addEventListener('mouseenter', (e) => {
                    TweenMax.ticker.addEventListener('tick', animateBlobs, link);
                });

                link.addEventListener('mouseleave', (e) => {
                    TweenMax.ticker.removeEventListener('tick', animateBlobs);

                    var blobs = link.querySelectorAll('.list__icon');

                    hideBlobs(blobs);
                });

            });
        }


        function ready () {
            cursorBlobs();
        }

        return {
            name: globName,
            ready: ready
        };
    }();

    /**
    * Context relative assignation
    */
    if (typeof module !== 'undefined') { module.exports = myModule; }
    else if (typeof define === 'function' && define.amd) { define(myModule); }
    else { global[globName] = myModule; }
})(window);
