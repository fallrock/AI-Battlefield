'use strict';

let sizes = {
    canvas: {w: null, h: null},
    map: {w: null, h: null},
    scale: null,
    strokeW: null,
    strokeW_bold: null,
    canvasRef: null,
};

function onWindowResized() {
    let size = Math.min(windowWidth, windowHeight);
    size *= 0.95;  ///TODO: solve via css
    resizeCanvas(size + 1, size + 1);
    _centerCanvas();
    _recalcSizes({w: size, h: size}, sizes.map);
}

function onMapChanged(mapDims) {
    _recalcSizes(sizes.canvas, mapDims);
}

function _centerCanvas() {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    sizes.canvasRef.position(x, y);
}

function _recalcSizes(canvas, map) {
    if (map.w == null) {
        sizes.canvas = canvas;
        return;
    }
    sizes.map.w = map.w;
    sizes.map.h = map.h;
    if (canvas.w == null) { return; }
    sizes.scale = Math.min(canvas.w / sizes.map.w, canvas.h / sizes.map.h);
    sizes.canvas.w = sizes.map.w * sizes.scale;
    sizes.canvas.h = sizes.map.h * sizes.scale;
    sizes.strokeW = Math.max(1, sizes.scale / 50);
    sizes.strokeW_bold = Math.max(1, sizes.scale / 25);
}
