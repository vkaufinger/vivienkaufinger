(function (global) {
    var globName = 'mainApp';

    /**
    * Main module
    */
    var myModule = function () {
        var debounce = require('throttle-debounce/debounce');
        var modules = [
            require('./utils'),
            require('./transversal'),
            require('./blobs'),
            require('./projects')
        ];

        /**
        * Modules "magic" methods bindings
        */
        function modMagic() {
            document.addEventListener('DOMContentLoaded', function (e) {
                // DOM ready
                modules.forEach(function (module) {
                    if (typeof module.ready !== 'undefined') {
                        module.ready();
                    }
                });

                // Smooth scroll callback
                var smooth = require('./utils.js').smooth;
                var lastScroll = 0;

                smooth.callback = function (scrollY) {
                    var direction = lastScroll < scrollY ? 'down' : 'up';
                    lastScroll = scrollY;

                    modules.forEach(function (module) {
                        if (typeof module.onScroll !== 'undefined') {
                            module.onScroll(direction, scrollY);
                        }
                    });
                };
            });


            // Ajax start
            document.addEventListener('pjax:complete', function (e) {
                modules.forEach(function (module) {
                    if (typeof module.ajaxStart !== 'undefined') {
                        module.ajaxStart();
                    }
                });
            });


            // Ajax is complete
            document.addEventListener('ajaxComplete', function () {
                window.ajaxUpdate = false;
                modules.forEach(function (module) {
                    if (typeof module.ajaxComplete !== 'undefined') {
                        module.ajaxComplete();
                    }
                });
            });


            // Window resize
            window.addEventListener('resize', debounce(200, function (e) {
                // Don't bind pjax resize event
                if (e.eventName === 'resize') {
                    return;
                }
                modules.forEach(function (module) {
                    if (typeof module.resize !== 'undefined') {
                        module.resize(e);
                    }
                });
            }));
        }

        function init() {
            modMagic();
        }

        return {
            name: globName,
            init: init
        };
    }();

    /**
    * Context relative assignation
    */
    if (typeof module !== 'undefined') { module.exports = myModule; }
    else if (typeof define === 'function' && define.amd) { define(myModule); }
    else { global[globName] = myModule; }
})(window);
