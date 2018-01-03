(function (global) {
    var globName = 'myModule';

    /**
    * Smooth scroll module
    */
    var myModule = function () {
        var Smooth = require('smooth-scrolling').default;

        class Parallax extends Smooth {
            constructor (opt) {
                super(opt);

                this.createExtraBound();

                this.resizing = false;
                this.cache = null;
                this.dom.divs = Array.prototype.slice.call(opt.divs, 0);
            }
            createExtraBound () {
                ['getCache', 'inViewport']
                .forEach((fn) => this[fn] = this[fn].bind(this));
            }
            resize () {
                this.resizing = true;

                this.getCache();

                super.resize();

                this.resizing = false;
            }
            getCache () {
                this.cache = [];

                this.dom.divs.forEach((el, index) => {
                    el.style.display = 'block';
                    el.style.transform = 'none';

                    const scrollY = this.vars.target;
                    const bounding = el.getBoundingClientRect();
                    const bounds = {
                        el: el,
                        state: true,
                        top: bounding.top + scrollY,
                        left: bounding.left,
                        center: bounding.height / 2,
                        bottom: bounding.bottom + scrollY,
                        speed: el.getAttribute('data-speed') || '-1'
                    };

                    this.cache.push(bounds);
                });

                // get bounding value based on the container (.vs-section) height
                this.vars.bounding = this.dom.section.getBoundingClientRect().height - (this.vars.native ? 0 : this.vars.height);
            }
            run () {
                this.dom.divs.forEach(this.inViewport);

                this.dom.section.style[this.prefix] = this.getTransform(-this.vars.current.toFixed(2));

                super.run();
            }
            inViewport (el, index) {
                if (!this.cache || this.resizing) {
                    return;
                }
                const cache = this.cache[index];
                const current = this.vars.current;
                const transform = ((cache.top + cache.center) - current) * cache.speed;
                const top = Math.round((cache.top + transform) - current);
                const bottom = Math.round((cache.bottom + transform) - current);
                const inview = bottom > 0 && top < this.vars.height;

                if (inview) {
                    el.classList.add('in-view');
                    if (cache.speed !== '0') {
                        el.style[this.prefix] = this.getTransform(transform.toFixed(2));
                    }
                } else {
                    el.classList.remove('in-view');
                }
            }
        }


        return {
            name: globName,
            Parallax: Parallax
        };
    }();

    /**
    * Context relative assignation
    */
    if (typeof module !== 'undefined') { module.exports = myModule; }
    else if (typeof define === 'function' && define.amd) { define(myModule); }
    else { global[globName] = myModule; }
})(window);
