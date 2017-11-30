(function (global) {
    var globName = 'myModule';

    /**
    * Ajax navigation
    */
    var myModule = function () {
        var Pjax = require('pjax');
        var requestInterval = require('request-interval');
        var bubble = require('bubble-event');
        var ajaxSettings = {
            debug: false,
            elements: 'null',
            selectors: [ 'title', '#ajax-wrapper' ],
            switches: { '#ajax-wrapper': updateContent }
        };
        window.ajaxUpdate = false;
        window.ajaxRoutes = {};
        var pjaxInstance;
        var ajaxWrapper;


        function ajaxAttributes (oldEl, newEl) {
            // Get the current page which will become the previous page
            ajaxRoutes.previous = oldEl.getAttribute('data-ajax-current');

            // Set the next page
            ajaxRoutes.next = newEl.getAttribute('data-ajax-current');

            // Remove cursor "wait"
            oldEl.classList.remove('js-ajax-loading');
        }


        // Use a class to set active state and disable click on active links
        function activeState (oldEl, newEl) {
            var classList = [];
            newEl.querySelectorAll('.js-nav-link').forEach(function (newLink) {
                classList.push(newLink.className);
            });
            oldEl.querySelectorAll('.js-nav-link').forEach(function (oldLink, i) {
                oldLink.className = classList[i];
            });
        }


        // Wait page transition is complete before to update the dom
        function domUpdate (oldEl, newEl) {
            var interval = requestInterval(100, function() {
                if (window.ajaxUpdate) {
                    // Kill interval
                    requestInterval.clear(interval);

                    // Set the new current page
                    ajaxRoutes.current = ajaxRoutes.next;
                    oldEl.setAttribute('data-ajax-current', ajaxRoutes.current);

                    // Empty next route
                    ajaxRoutes.next = null;

                    // Update html content
                    oldEl.querySelector('#ajax-content').outerHTML = newEl.querySelector('#ajax-content').outerHTML;
                    oldEl.className = newEl.className;

                    // Ajax is complete
                    bubble(document, 'ajaxComplete');
                }
            });
        }


        // Show cursor "wait" when request begins
        function ajaxLoader () {
            document.addEventListener('pjax:send', function (e) {
                ajaxWrapper.classList.add('js-ajax-loading');
            });
        }


        function updateContent (oldEl, newEl) {
            ajaxAttributes(oldEl, newEl);

            activeState(oldEl, newEl);

            domUpdate(oldEl, newEl);
        }


        function loadManually () {
            document.addEventListener('click', function (e) {
                if (!e.target.matches('.js-ajax-link')) {
                    return;
                }

                e.preventDefault();

                // Prevent click on active links
                if (!e.target.classList.contains('is-active')) {

                    // Manual request
                    var url = e.target.getAttribute('href');
                    pjaxInstance.loadUrl(url, ajaxSettings);
                }
            }, true);
        }


        function ready () {
            ajaxWrapper = document.getElementById('ajax-wrapper');

            ajaxRoutes.current = ajaxWrapper.getAttribute('data-ajax-current');

            pjaxInstance = new Pjax(ajaxSettings);

            ajaxLoader();

            loadManually();
        }

        return {
            name: globName,
            ready: ready,
            ajaxStart: function () {
                console.log(ajaxRoutes.current + ' -> ' + ajaxRoutes.next);
                ajaxUpdate = true;
            }
        };
    }();

    /**
    * Context relative assignation
    */
    if (typeof module !== 'undefined') { module.exports = myModule; }
    else if (typeof define === 'function' && define.amd) { define(myModule); }
    else { global[globName] = myModule; }
})(window);
