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

const mk_m2s = function(pos, rot, map, screen) {
    const mapScale    = Math.max(...map.array);
    const screenScale = Math.max(...screen.array);
    const imMlt = (a, b) => new Vec2(
        a.x * b.x - a.y * b.y,
        a.x * b.y + a.y * b.x
    );
    return function(vert) {
        let ret = vert.clone();
        ret.sub(0.5);           // Center model
        ret.y = 1 - ret.y;      // Flip model
        ret.mult(0.5);          // Model space to world space scale
        ret = imMlt(ret, rot);  // Model space to world space rotation
        ret.add(pos);           // Model space to world space position
        ret.div(mapScale);      // World space to NDC
        ret.mult(screenScale);  // NDC to screen space
        return ret;
    }
}

class View {
    canvas = null;
    gamestate = null;   ///TODO: crutch

    constructor(canvas_parent) {
        p5.disableFriendlyErrors = true;
        this.canvas = new p5((p) => {

            ///TODO: closures

            p.setup = () => {
                p.noCanvas();
                p.noLoop();
                const c = p.createCanvas(100, 100);
                sizes.canvasRef = c;
                onWindowResized(p);
            };

            p.windowResized = () => {
                onWindowResized(p);
            };

            p.draw = () => {
                if (!this.gamestate) return;

                p.background(0);

                p.strokeWeight(0);

                this.gamestate.drones.forEach((drone) => {
                    const pos = new Vec2(drone.pos.x, drone.pos.y);
                    const rot = new Vec2(
                        Math.cos(p.radians(drone.input.rotation + 90)),
                        Math.sin(p.radians(drone.input.rotation + 90)),
                    );
                    const map = new Vec2(this.gamestate.map.w, this.gamestate.map.h);
                    const screen = new Vec2(p.width, p.height);

                    const m2s = mk_m2s(pos, rot, map, screen);

                    const c = p.color(15, 3, 252);
                    p.noFill();
                    p.stroke(c);
                    p.strokeWeight(sizes.strokeW);

                    p.beginShape();
                    p.vertex(...m2s(new Vec2(0.0, 0.0  ) ).array);
                    p.vertex(...m2s(new Vec2(0.5, 1.0  ) ).array);
                    p.vertex(...m2s(new Vec2(1.0, 0.0  ) ).array);
                    p.vertex(...m2s(new Vec2(0.5, 0.25 ) ).array);
                    p.endShape(p.CLOSE);




                    // const radians = drone.input.rotation * Math.PI / 180;
                    // const p1 = [
                    //     p[0] + r * Math.cos(radians),
                    //     p[1] + r * Math.sin(radians),
                    // ];
                    //
                    // p.circle(...w2sp(p), w2ss(r*2));
                    // p.line(...w2sp(p), ...w2sp(p1));
                });

            };

        }, canvas_parent);
    }

    update(gamestate) {
        this.gamestate = gamestate;
        // console.log(gamestate);
        this.canvas.redraw();
    }
}


const app = new Application(new View('p5canvas'));
app.connect(config.host, config.port);
