'use strict';

let sizes = {
    canvas: {w: null, h: null},
    map: {w: null, h: null},
    scale: null,
    strokeW: 1,
    strokeW_bold: 1,
    droneR: null,
};

function onWindowResized() {
    let size = Math.min(windowWidth, windowHeight);
    size *= 0.95;
    resizeCanvas(size + 1, size + 1);
    // centerCanvas();
    recalcSizes({w: size, h: size}, sizes.map);
}

function onMapChanged(mapDims) {
    recalcSizes(sizes.canvas, mapDims);
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

function recalcSizes(canvas, map) {
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
    sizes.droneR = Math.max(sizes.scale - 2, sizes.scale * 0.8);
}

// module.exports = {
//     sizes,
//     onWindowResized,
//     onMapChanged,
// }
