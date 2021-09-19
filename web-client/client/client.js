'use strict';

const config = {
    host: 'localhost',
    port: '8081'
};

class Application {
    view = null;
    socket = null;
    gamestate = {};

    constructor(renderer) {
        this.view = renderer;
    }

    connect(host, port) {
        this.socket = new WebSocket(`ws://${host}:${port}`);
        this.socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case 'gamestate':
                    this.onGameStateUpdate(message.gamestate);
                    break;
                default:
                    console.error(`unknown message type ${JSON.stringify(message)}`);
            }
        });
    }

    onGameStateUpdate(gamestate) {
        this.gamestate = gamestate;
        this.updateView();
        const mapDims = {w: gamestate.map.w, h: gamestate.map.h};
        onMapChanged(mapDims);
    }

    updateView() {
        this.view.update(this.gamestate);
    }

    requestGameState() {
        const request = {
            type: 'gamestate'
        };
        const message = JSON.stringify(request);
        this.socket.send(message);
    }

}

///TODO: I don't know what to do, but this is dumb

let sizes = {
    canvas: {w: null, h: null},
    map: {w: null, h: null},
    scale: null,
    strokeW: null,
    strokeW_bold: null,
    canvasRef: null,
};

function onWindowResized(canvas) {
    let size = Math.min(canvas.windowWidth, canvas.windowHeight);
    size *= 0.95;  ///TODO: solve via css
    canvas.resizeCanvas(size + 1, size + 1);
    _centerCanvas(canvas);
    _recalcSizes({w: size, h: size}, sizes.map);
}

function onMapChanged(mapDims) {
    _recalcSizes(sizes.canvas, mapDims);
}

function _centerCanvas(canvas) {
    let x = (canvas.windowWidth - canvas.width) / 2;
    let y = (canvas.windowHeight - canvas.height) / 2;
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

class View {
    p5 = null;
    gamestate = null;   ///TODO: crutch

    constructor(dom_canvas) {
        p5 = new p5((canvas) => {

            ///TODO: closures

            canvas.setup = () => {
                canvas.noCanvas();
                canvas.noLoop();
                const c = canvas.createCanvas(100, 100);
                sizes.canvasRef = c;
                onWindowResized(canvas);
            };

            canvas.windowResized = () => {
                onWindowResized(canvas);
            };

            canvas.draw = () => {
                if (!this.gamestate) return;

                canvas.background(0);

                // world to screen utilities
                const w2ss = (scalar) => {
                    return scalar * sizes.scale;
                };
                const w2sp = (pos) => {
                    return [
                        w2ss(pos[0]),
                        sizes.canvas.h - w2ss(pos[1])
                    ];
                };

                canvas.strokeWeight(0);

                this.gamestate.drones.forEach((drone) => {
                    const scale = sizes.scale;
                    const r = 0.5;   // in-world size
                    const p = [drone.pos.x, drone.pos.y];
                    const c = canvas.color(15, 3, 252);

                    const radians = drone.input.rotation * Math.PI / 180;
                    const p1 = [
                        p[0] + r * Math.cos(radians),
                        p[1] + r * Math.sin(radians),
                    ];

                    canvas.noFill();
                    canvas.stroke(c);
                    canvas.strokeWeight(sizes.strokeW);
                    canvas.circle(...w2sp(p), w2ss(r*2));
                    canvas.line(...w2sp(p), ...w2sp(p1));
                });

            };

        }, dom_canvas);
    }

    update(gamestate) {
        this.gamestate = gamestate;
        // console.log(gamestate);
        p5.redraw();
    }
}


const app = new Application(new View('p5canvas'));
app.connect(config.host, config.port);
