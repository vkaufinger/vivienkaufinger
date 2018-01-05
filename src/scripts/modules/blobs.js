(function (global) {
    var globName = 'myModule';

    /**
    * Blob module
    */
    var myModule = function () {
        var paper = require('paper');
        var debounce = require('throttle-debounce/debounce');
        var shapes;
        var scene;
        var view;
        var Point;
        var Path;
        var Group;
        var smooth;
        var mouseForce;
        var mousePoint;

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        class Blob {
            constructor (el) {
                this.path        = el.path;
                this.color       = el.color;
                this.size        = el.size;
                this.position    = el.position;
                this.scrollSpeed = el.scrollSpeed;
                this.threshold   = Math.min(this.size[0], this.size[1]) / 2;

                // Create a fit rect to define shape position
                this.fitRect = new Path.Rectangle(this.position, this.size);
                // this.fitRect.strokeColor = 'blue';

                // Create the shape
                this.shapeGen();

                // Settings pro segment
                this.getSegments();
            }
            shapeGen () {
                this.shapePath           = new Path(this.path);
                this.shapePath.fillColor = this.color;
                this.shapePath.blendMode = 'multiply';

                // Fit circle with rectangle
                this.shapePath.fitBounds(this.fitRect.bounds, true);

                this.group = new Group([this.shapePath]);
                this.scrollY = this.group.position.y;

                // Create a clone
                this.controlCircle = this.shapePath.clone();
                this.controlCircle.visible = false;
            }
            getSegments () {
                // Define rotation speed
                const rotationMultiplicator = Math.min(this.size[0], this.size[1]) / getRandomInt(400, 600);

                this.settings = [];

                for (var i = this.shapePath.segments.length - 1; i >= 0; i--) {
                    this.settings.push({
                        offsetX: rotationMultiplicator,
                        offsetY: rotationMultiplicator,
                        momentum: new Point(0,0)
                    });
                }
            }
            clear () {
                this.shapePath.remove();
                this.fitRect.remove();
            }
            animate (event) {
                if (this.scrollSpeed !== 0) {
                    this.group.position.y = this.scrollY - (smooth.vars.current * this.scrollSpeed);
                }

                // Stop item if is off view : browser says thanks ;-)
                if (this.group.bounds.bottom < 0 || this.group.bounds.top > scene.view.size.height) {
                    return;
                }

                // Transform shape segments
                for (var i = this.settings.length - 1; i >= 0; i--) {
                    var segment = this.shapePath.segments[i];

                    var settings = this.settings[i];
                    var controlPoint = this.controlCircle.segments[i].point;

                    // Avoid the mouse
                    var mouseOffset = mousePoint.subtract(controlPoint);
                    var mouseDistance = mousePoint.getDistance(controlPoint);
                    var newDistance = 0;

                    if (mouseDistance < this.threshold) {
                        newDistance = (mouseDistance - this.threshold) * mouseForce;
                    }

                    var newOffset = new Point(0, 0);
                    if (mouseDistance !== 0) {
                        newOffset = new Point(mouseOffset.x / mouseDistance * newDistance, mouseOffset.y / mouseDistance * newDistance);
                    }
                    var newPosition = controlPoint.add(newOffset);

                    var distanceToNewPosition = segment.point.subtract(newPosition);

                    settings.momentum = settings.momentum.subtract(distanceToNewPosition.divide(6));
                    settings.momentum = settings.momentum.multiply(0.6);

                    // Add automatic rotation
                    var amountX = settings.offsetX;
                    var amountY = settings.offsetY;
                    var sinus = Math.sin(event.time + i * 2);
                    var cos =  Math.cos(event.time + i * 2);
                    settings.momentum = settings.momentum.add(new Point(cos * -amountX, sinus * -amountY));

                    // go to the point, now!
                    segment.point = segment.point.add(settings.momentum);
                }
            }
        }


        function dataShapes () {
            var vw = scene.view.bounds.width;
            var vh = scene.view.bounds.height;

            shapes = [
                // Intro
                { path: 'M34.046,729.082 C235.896,1334.609 995.948,1519.606 1596.445,1452.280 C2250.954,1378.899 2810.577,901.647 2682.000,601.000 C2390.905,-79.657 -328.624,-358.885 34.046,729.082 Z', color: '#fc6964', size: [vw * 0.8, vh * 0.9], position: [vw * 0, vh * 0.1], scrollSpeed: 0.9 },
                { path: 'M522.699,88.286 C-42.317,256.813 -361.462,1054.541 698.164,1341.627 C1757.791,1628.712 2687.238,986.133 2674.884,544.512 C2662.531,102.893 1295.841,-142.316 522.699,88.286 Z', color: '#fc6964', size: [vw * 0.8, vh * 0.8], position: [vw * 0.27, vh * -0.2], scrollSpeed: 0.7 },
                { path: 'M777.178,105.256 C1678.812,-435.186 2415.895,1274.091 1317.056,1424.686 C564.690,1527.796 -83.253,1315.659 8.747,1004.662 C100.746,693.665 450.909,300.822 777.178,105.256 Z', color: '#3f555e', size: [vw * 0.5, vh * 0.9], position: [vw * 0.15, vh * -0.21], scrollSpeed: 1.3 },
                { path: 'M508.785,884.410 C-254.041,381.310 -241.252,-121.338 1114.208,26.082 C1534.076,71.748 1678.535,107.459 1728.184,331.266 C1892.251,1070.844 1138.742,1299.881 508.785,884.410 Z', color: '#a172f3', size: [vw * 0.6, vh * 0.5], position: [vw * 0.47, vh * 0.37], scrollSpeed: 1 },
                { path: 'M322.183,646.249 C646.445,681.893 789.835,527.365 793.317,375.852 C797.112,210.714 587.157,12.389 424.360,1.408 C55.791,-23.452 -260.427,582.208 322.183,646.249 Z', color: '#a172f3', size: [vw * 0.3, vh * 0.45], position: [vw * 0.07, vh * 0.9], scrollSpeed: 1.5 },

                // Projects
                { path: 'M4.669,164.583 C21.259,220.635 153.569,285.238 228.003,208.398 C302.437,131.559 211.213,22.220 133.650,2.565 C56.087,-17.089 -18.030,87.882 4.669,164.583 Z', color: '#fc6964', size: [vw * 0.08, vh * 0.15], position: [vw * 0.26, vh * 2.2], scrollSpeed: 1.35 },
                { path: 'M52.165,8.622 C-3.182,25.082 -34.445,102.991 69.353,131.030 C173.152,159.067 264.199,96.310 262.989,53.179 C261.779,10.049 127.900,-13.899 52.165,8.622 Z', color: '#3f555e', size: [vw * 0.05, vh * 0.085], position: [vw * 0.65, vh * 4.7], scrollSpeed: 1.5 },
                { path: 'M992.275,441.058 C1157.959,-45.335 747.331,-52.144 356.494,60.890 C52.517,148.802 -17.442,266.939 3.409,422.809 C72.314,937.890 814.451,963.094 992.275,441.058 Z', color: '#a172f3', size: [vw * 0.4, vh * 0.4], position: [vw * 0.6,  vh * 3.1], scrollSpeed: 0.9 },

                // Experiences
                // { path: 'M3.072,97.604 C11.541,133.243 96.810,126.644 131.190,110.045 C179.609,86.667 119.379,-14.764 68.919,2.036 C30.135,14.947 -8.517,48.835 3.072,97.604 Z', color: '#3f555e', size: [vw * 0.06, vh * 0.05], position: [vw * 0.17,  vh * 3.45], scrollSpeed: 0.65 },
                // { path: 'M108.780,33.085 C127.335,58.070 80.700,90.776 52.992,95.615 C13.970,102.431 -20.866,15.792 14.968,4.159 C42.511,-4.781 83.389,-1.103 108.780,33.085 Z', color: '#a172f3', size: [vw * 0.06, vh * 0.03], position: [vw * 0.18,  vh * 3.46], scrollSpeed: 0.65 },
                // { path: 'M3.072,97.604 C11.541,133.243 96.810,126.644 131.190,110.045 C179.609,86.667 119.379,-14.764 68.919,2.036 C30.135,14.947 -8.517,48.835 3.072,97.604 Z', color: '#3f555e', size: [vw * 0.06, vh * 0.05], position: [vw * 0.34,  vh * 3.45], scrollSpeed: 0.65 },
                // { path: 'M108.780,33.085 C127.335,58.070 80.700,90.776 52.992,95.615 C13.970,102.431 -20.866,15.792 14.968,4.159 C42.511,-4.781 83.389,-1.103 108.780,33.085 Z', color: '#a172f3', size: [vw * 0.06, vh * 0.03], position: [vw * 0.375,  vh * 3.46], scrollSpeed: 0.65 },
                // { path: 'M3.072,97.604 C11.541,133.243 96.810,126.644 131.190,110.045 C179.609,86.667 119.379,-14.764 68.919,2.036 C30.135,14.947 -8.517,48.835 3.072,97.604 Z', color: '#3f555e', size: [vw * 0.06, vh * 0.05], position: [vw * 0.505,  vh * 3.45], scrollSpeed: 0.65 },
                // { path: 'M108.780,33.085 C127.335,58.070 80.700,90.776 52.992,95.615 C13.970,102.431 -20.866,15.792 14.968,4.159 C42.511,-4.781 83.389,-1.103 108.780,33.085 Z', color: '#a172f3', size: [vw * 0.06, vh * 0.03], position: [vw * 0.54,  vh * 3.46], scrollSpeed: 0.65 }

                // Contact
                { path: 'M992.275,441.059 C1157.959,-45.335 747.331,-52.143 356.494,60.890 C52.517,148.803 -17.442,266.939 3.409,422.810 C72.314,937.890 814.451,963.094 992.275,441.059 Z', color: '#f92b27', size: [vw * 0.325, vh * 0.4], position: [vw * 0.53,  vh * 4.42], scrollSpeed: 0.75 },
                { path: 'M34.046,729.082 C235.897,1334.608 995.948,1519.605 1596.445,1452.279 C2250.954,1378.899 2810.577,901.647 2682.000,601.000 C2390.905,-79.658 -328.624,-358.885 34.046,729.082 Z', color: '#ececec', size: [vw * 0.8, vh * 0.7], position: [vw * 0.45,  vh * 3.3], scrollSpeed: 0.5 }

            ];
        }


        function sceneRAF () {
            view.onFrame = function (e) {
                shapes.forEach(function (el) {
                    el.blob.animate(e);
                });
            };
        }


        function sceneMousemove () {
            var tool = new scene.Tool();
            tool.onMouseMove = function (e) {
                mousePoint = e.lastPoint;
            };
        }


        function sceneInit (el) {
            const canvas = document.getElementById(el);

            if (!canvas) {
                return;
            }

            // Add attribute with js because is not W3C valid :-/
            canvas.setAttribute('resize', true);

            scene = paper.setup(canvas);
            view = scene.view;
            Point = scene.Point;
            Path = scene.Path;
            Group = scene.Group;
            smooth = require('./utils.js').smooth;
            mouseForce = 0.2;
            mousePoint = new Point(-1000, -1000);

            dataShapes();

            shapes.forEach(function (el) {
                el.blob = new Blob(el);
            });

            sceneRAF();

            sceneMousemove();
        }


        function ready () {
            sceneInit('blob-canvas');
        }


        function resize () {
            // Redraw shapes in scene after view resizing
            shapes.forEach(function (el) {
                el.blob.clear();
            });

            dataShapes();

            shapes.forEach(function (el) {
                el.blob = new Blob(el);
            });
        }

        return {
            name: globName,
            ready: ready,
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
