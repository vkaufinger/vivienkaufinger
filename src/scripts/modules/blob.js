(function (global) {
    var globName = 'myModule';

    /**
    * Blob module
    */
    var myModule = function () {
        var smooth = require('./utils.js').smooth;

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        class Blob {
            constructor (scene, el) {
                this.sceneInit(scene);

                this.type = el.type;
                this.color = el.color;
                this.position = el.position;
                this.size = el.size;
                this.rotation = el.rotation;
                this.mirror = el.mirror;
                this.scrollSpeed = el.scrollSpeed;
                this.threshold = Math.min(this.size[0], this.size[1]) * 0.3;

                // Create a fit rect to defin shape position
                this.fitRect = new this.Path.Rectangle(this.position, this.size);

                // Create the shape
                this.shapeGen();

                // Settings pro segment
                this.getSegments();
            }
            sceneInit (scene) {
                this.scene = scene;
                this.view  = scene.view;
                this.Point = scene.Point;
                this.Path  = scene.Path;
                this.Group = scene.Group;
            }
            shapeGen () {
                this.circlePath = new this.Path.RegularPolygon(this.size, 3, 1);
                this.circlePath.fillColor = this.color;
                this.circlePath.blendMode = 'multiply';

                if (this.type === 'triangle') {
                    this.circlePath.scale([1.05, 1]);
                    this.circlePath.skew([-20, 0]);
                } else {
                    this.circlePath.scale([1.7, this.mirror ? -1 : 1]);
                    this.circlePath.skew([15, 0]);
                }
                this.circlePath.rotate(this.rotation);

                // Smooth path to restor the circular shape
                this.circlePath.smooth();

                // Fit circle with rectangle
                this.circlePath.fitBounds(this.fitRect.bounds);

                this.group = new this.Group([this.circlePath]);
                this.scrollY = this.group.position.y;

                // Create a clone
                this.controlCircle = this.circlePath.clone();
                this.controlCircle.visible = false;
            }
            getSegments () {
                const rotationMultiplicator = Math.min(this.size[0], this.size[1]) / getRandomInt(300,500);

                this.settings = [];

                for (var i = this.circlePath.segments.length - 1; i >= 0; i--) {
                    this.settings.push({
                        offsetX: rotationMultiplicator,
                        offsetY: rotationMultiplicator,
                        momentum: new this.Point(0,0)
                    });
                }
            }
            clear () {
                this.circlePath.remove();
                this.fitRect.remove();
            }
            animate (event, scene) {
                // Parallax
                this.group.position.y = this.scrollY + (smooth.vars.current * this.scrollSpeed);

                // Transform shape segments
                for (var i = this.settings.length - 1; i >= 0; i--) {
                    var segment = this.circlePath.segments[i];

                    var settings = this.settings[i];
                    var controlPoint = this.controlCircle.segments[i].point;

                    // Avoid the mouse
                    var mouseOffset = scene.mousePoint.subtract(controlPoint);
                    var mouseDistance = scene.mousePoint.getDistance( controlPoint );
                    var newDistance = 0;
                    // console.log(this.mousePoint)

                    if (mouseDistance < this.threshold) {
                        newDistance = (mouseDistance - this.threshold) * scene.mouseForce;
                    }

                    var newOffset = new this.Point(0, 0);
                    if (mouseDistance !== 0) {
                        newOffset = new this.Point(mouseOffset.x / mouseDistance * newDistance, mouseOffset.y / mouseDistance * newDistance);
                    }
                    var newPosition = controlPoint.add( newOffset );

                    var distanceToNewPosition = segment.point.subtract( newPosition );

                    settings.momentum = settings.momentum.subtract(distanceToNewPosition.divide(6));
                    settings.momentum = settings.momentum.multiply(0.6);

                    // Add automatic rotation
                    var amountX = settings.offsetX;
                    var amountY = settings.offsetY;
                    var sinus = Math.sin(event.time + i * 2);
                    var cos =  Math.cos(event.time + i * 2);
                    settings.momentum = settings.momentum.add(new this.Point(cos * -amountX, sinus * -amountY));

                    // go to the point, now!
                    segment.point = segment.point.add(settings.momentum);
                }
            }
        }


        function ready () {
        }

        return {
            name: globName,
            ready: ready,
            blob: Blob
        };
    }();

    /**
    * Context relative assignation
    */
    if (typeof module !== 'undefined') { module.exports = myModule; }
    else if (typeof define === 'function' && define.amd) { define(myModule); }
    else { global[globName] = myModule; }
})(window);
