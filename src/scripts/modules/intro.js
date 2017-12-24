(function (global) {
    var globName = 'myModule';

    /**
    * Intro
    */
    var myModule = function () {
        var paper = require('paper');
        var debounce = require('throttle-debounce/debounce');
        var shapes = [
            { type: 'ellipse',  color: '#fc6964', rotation: 0,    scrollSpeed: 0.3 },
            { type: 'ellipse',  color: '#fc6964', rotation: 0,    scrollSpeed: 0.15 },
            { type: 'triangle', color: '#3f555e', rotation: 10,   scrollSpeed: -0.5 },
            { type: 'ellipse',  color: '#a172f3', rotation: -0,   scrollSpeed: -0.15 },
            { type: 'triangle', color: '#a172f3', rotation: -130, scrollSpeed: -0.75 }
        ];
        var Blob;


        function setShapesPlace (scene) {
            var viewWidth = scene.view.bounds.width;
            var viewHeight = scene.view.bounds.height;

            shapes[0].size     = [viewWidth * 0.9,  viewHeight * 0.5];
            shapes[0].position = [viewWidth * -0.1, viewHeight * 0.05];

            shapes[1].size     = [viewWidth * 1,    viewHeight * 0.6];
            shapes[1].position = [viewWidth * 0.2,  viewHeight * -0.2];

            shapes[2].size     = [viewWidth * 0.5,  viewHeight * 0.55];
            shapes[2].position = [viewWidth * 0.15,  viewHeight * -0.2];

            shapes[3].size     = [viewWidth * 0.7,  viewHeight * 0.4];
            shapes[3].position = [viewWidth * 0.4,  viewHeight * 0.1];

            shapes[4].size     = [viewWidth * 0.4,  viewHeight * 0.3];
            shapes[4].position = [viewWidth * 0.05,  viewHeight * 0.5];
        }


        // Redraw shapes in scene after view resizing
        function sceneResize (scene) {
            scene.view.onResize = debounce(200, function (e) {
                setShapesPlace(scene);

                shapes.forEach(function (el) {
                    el.blob.clear();
                    el.blob = new Blob(scene, el);
                });
            });
        }


        function sceneRAF (scene) {
            scene.view.onFrame = function (e) {
                shapes.forEach(function (el) {
                    el.blob.animate(e, scene);
                });
            };
        }


        function sceneMousemove (scene) {
            var tool = new scene.Tool();
            tool.onMouseMove = function (e) {
                scene.mousePoint = e.lastPoint;
            };
        }


        function sceneInit (el) {
            if (!document.getElementById(el)) {
                return;
            }
            var scene = paper.setup(el);
            var Point = scene.Point;

            scene.mouseForce = 0.3;
            scene.mousePoint = new Point(-1000, -1000);

            setShapesPlace(scene);

            Blob = require('./blob').blob;
            shapes.forEach(function (el) {
                el.blob = new Blob(scene, el);
            });

            sceneRAF(scene);

            sceneMousemove(scene);

            sceneResize(scene);
        }


        function ready () {
            sceneInit('intro-canvas');
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
