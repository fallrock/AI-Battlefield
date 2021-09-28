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

    constructor(canvas_parent, tick1, tick2) {
        this.#ticks = new Switch(tick2, tick1);
        this.#p5 = new p5((p) => {

            p.setup = () => {
                this.#canvas = p.createCanvas(100, 100);
                // p.frameRate(10);
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
                const ti = f => p.lerp(f(this.#ticks.first.gamestate), f(this.#ticks.last.gamestate), tick_t);

                this.#ticks.first.gamestate.drones.forEach((_, drone_i) => {
                    const d1 = this.#ticks.first.gamestate.drones[drone_i];
                    const d2 = this.#ticks.last.gamestate.drones[drone_i];
                    const rot1 = new Vec2(
                        Math.cos(p.radians(d1.input.rotation)),
                        Math.sin(p.radians(d1.input.rotation)),
                    );
                    const rot2 = new Vec2(
                        Math.cos(p.radians(d2.input.rotation)),
                        Math.sin(p.radians(d2.input.rotation)),
                    );
                    // const pos = Vec2.lerp(d1.pos, d2.pos, tick_t);
                    // const rot = Vec2.lerp(rot1, rot2, tick_t).normalized;
                    const [pos, rot] = (() => {
                        const dt = this.#ticks.last.gamestate.deltaTime;
                        const p1 = new Vec2(d1.pos.x, d1.pos.y);
                        const p2 = new Vec2(d2.pos.x, d2.pos.y);
                        const v1 = rot1.clone();
                        const v2 = rot2.clone();
                        v1.mult(d1.input.enginePower);
                        v2.mult(d2.input.enginePower);
                        v1.mult(dt * 1/3);
                        v2.mult(dt * 1/3);
                        const pp1 = p1.clone();
                        const pp2 = p2.clone();
                        pp1.add(v1);
                        pp2.sub(v2);
                        const fakerot = Vec2.bezier_deriv(p1, pp1, pp2, p2, tick_t);
                        const realrot = Vec2.lerp(rot1, rot2, tick_t).normalized;
                        let rot;
                        if (dt >= 1) {
                            rot = fakerot.magnitude > 0.000001 ? fakerot.normalized : realrot;
                        } else {
                            rot = realrot;
                        }
                        return [
                            Vec2.bezier(p1, pp1, pp2, p2, tick_t),
                            rot,
                        ];
                    })();
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
    }
}


p5.disableFriendlyErrors = true;

const app = new Application();
app.onGameState = g1 => {
    app.onGameState = g2 => {
        const t1 = {gamestate: g1, time: Date.now()};
        const t2 = {gamestate: g2, time: Date.now()};
        let view = new View('p5canvas', t1, t2);
        app.onGameState = gamestate => view.update(gamestate);
    }
}
app.connect(config.host, config.port);
