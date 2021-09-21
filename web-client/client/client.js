'use strict';

const config = {
    host: 'localhost',
    port: '8081'
};

class Application {
    #socket = null;
    onGameState = null;

    connect(host, port) {
        this.#socket = new WebSocket(`ws://${host}:${port}`);
        this.#socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case 'gamestate':
                    if (this.onGameState !== null) {
                        this.onGameState(message.gamestate);
                    }
                    break;
                default:
                    console.error(`unknown message type ${JSON.stringify(message)}`);
            }
        });
    }
}

const mk_m2s = function(pos, rot, map, screen) {
    const mapScale    = Math.max(...map.array);
    const screenScale = Math.max(...screen.array);
    const imMlt = (a, b) => new Vec2(
        a.x * b.x - a.y * b.y,
        a.x * b.y + a.y * b.x
    );
    const d90 = new Vec2(0, 1);
    return function(vert) {
        let ret = vert.clone();
        ret.sub(0.5);           // Center model
        ret.y = 1 - ret.y;      // Flip model
        ret.mult(0.5);          // Model space to world space scale
        ret = imMlt(ret, d90);  // Model space to world space rotation
        ret = imMlt(ret, rot);  // Model space to world space rotation
        ret.add(pos);           // Model space to world space position
        ret.div(mapScale);      // World space to NDC
        ret.mult(screenScale);  // NDC to screen space
        return ret;
    }
}

class View {
    #p5 = null;
    #canvas = null;
    #gamestate = null;   ///TODO: crutch

    constructor(canvas_parent, gamestate) {
        this.#gamestate = gamestate;
        this.#p5 = new p5((p) => {

            ///TODO: closures

            p.setup = () => {
                this.#canvas = p.createCanvas(100, 100);
                p.noLoop();
                p.windowResized();
            };

            p.windowResized = () => {
                const size = Math.min(p.windowWidth, p.windowHeight);
                p.resizeCanvas(size, size);
            };

            p.draw = () => {
                p.background(0);

                this.#gamestate.drones.forEach((drone) => {
                    const pos = new Vec2(drone.pos.x, drone.pos.y);
                    const rot = new Vec2(
                        Math.cos(p.radians(drone.input.rotation)),
                        Math.sin(p.radians(drone.input.rotation)),
                    );
                    const map = new Vec2(this.#gamestate.map.w, this.#gamestate.map.h);
                    const screen = new Vec2(p.width, p.height);

                    const m2s = mk_m2s(pos, rot, map, screen);

                    const c = p.color(15, 3, 252);
                    p.noFill();
                    p.stroke(c);
                    p.strokeWeight(1);

                    p.beginShape();
                    p.vertex(...m2s(new Vec2(0.0, 0.0  ) ).array);
                    p.vertex(...m2s(new Vec2(0.5, 1.0  ) ).array);
                    p.vertex(...m2s(new Vec2(1.0, 0.0  ) ).array);
                    p.vertex(...m2s(new Vec2(0.5, 0.25 ) ).array);
                    p.endShape(p.CLOSE);
                });
            };

        }, canvas_parent);
    }

    update(gamestate) {
        this.#gamestate = gamestate;
        // console.log(gamestate);
        this.#p5.redraw();
    }
}


p5.disableFriendlyErrors = true;

const app = new Application();
app.onGameState = gamestate => {
    let view = new View('p5canvas', gamestate);
    app.onGameState = gamestate => view.update(gamestate);
}
app.connect(config.host, config.port);
