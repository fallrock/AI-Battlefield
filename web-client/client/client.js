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

class Switch {
    #a = [null, null];
    #i = 0;
    constructor(last, first = null) {
        this.push(first);
        this.push(last);
    }
    get first() {
        return this.#a[(this.#i + 1) % 2];
    }
    get last() {
        return this.#a[this.#i];
    }
    push(v) {
        this.#i = (this.#i + 1) % 2;
        this.#a[this.#i] = v;
    }
}

class View {
    #p5 = null;
    #canvas = null;
    #ticks = null;

    constructor(canvas_parent, gamestate) {
        const tick = {gamestate, time: Date.now()};
        this.#ticks = new Switch(tick, tick);
        this.#p5 = new p5((p) => {

            p.setup = () => {
                this.#canvas = p.createCanvas(100, 100);
                // p.noLoop();
                p.windowResized();
            };

            p.windowResized = () => {
                const size = Math.min(p.windowWidth, p.windowHeight);
                p.resizeCanvas(size, size);
            };

            p.draw = () => {
                p.background(0);

                const inv_lerp = (a, b, v) => (v - a) / (b - a);
                const tick_t = Math.max(0, Math.min(1, inv_lerp(
                    this.#ticks.last.time,
                    this.#ticks.last.time + this.#ticks.last.gamestate.deltaTime * 1000,
                    Date.now()
                )));
                const lerp = (a, b, t) => a * (1 - t) + b * t;
                const interp = lerp;
                const ti = f => interp(f(this.#ticks.first.gamestate), f(this.#ticks.last.gamestate), tick_t);
                // console.log(tick_t);

                this.#ticks.first.gamestate.drones.forEach((_, drone_i) => {
                    const pos = new Vec2(ti(e => e.drones[drone_i].pos.x), ti(e => e.drones[drone_i].pos.y));
                    const rot = Vec2.lerp(
                        new Vec2(
                            Math.cos(p.radians(this.#ticks.first.gamestate.drones[drone_i].input.rotation)),
                            Math.sin(p.radians(this.#ticks.first.gamestate.drones[drone_i].input.rotation)),
                        ),
                        new Vec2(
                            Math.cos(p.radians(this.#ticks.last.gamestate.drones[drone_i].input.rotation)),
                            Math.sin(p.radians(this.#ticks.last.gamestate.drones[drone_i].input.rotation)),
                        ),
                        tick_t
                    ).normalized;
                    const map = new Vec2(ti(e => e.map.w), ti(e => e.map.h));
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
        this.#ticks.push({gamestate, time: Date.now()});
        // console.log(gamestate);
        // this.#p5.redraw();
    }
}


p5.disableFriendlyErrors = true;

const app = new Application();
app.onGameState = gamestate => {
    let view = new View('p5canvas', gamestate);
    app.onGameState = gamestate => view.update(gamestate);
}
app.connect(config.host, config.port);
