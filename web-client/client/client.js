const config = {
    host: 'localhost',
    port: '8081'
}

class Application {
    renderer = null;
    socket = null;
    gamestate = {};

    constructor(renderer) {
        this.renderer = renderer;
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
                    console.log(`unknown message type ${JSON.stringify(message)}`);
            }
        });
    }

    onGameStateUpdate(gamestate) {
        this.gamestate = gamestate;
        this.render();
        const mapDims = {w: gamestate.map.width, h: gamestate.map.height};
        onMapChanged(mapDims);
        // console.log(gamestate.drones);
    }

    render() {
        this.renderer.render(this.gamestate);
    }

    requestGameState() {
        const request = {
            type: 'gamestate'
        };
        const message = JSON.stringify(request);
        this.socket.send(message);
    }

}


/* temp */
// mb put it into class and bind()
///TODO: this is super evil
let gamestate = null;
class Renderer {
    render(gamestate_local) {
        gamestate = gamestate_local;
    }
}
function setup() {
    c = createCanvas(100, 100);
    sizes.canvasRef = c;
    onWindowResized();
    // frameRate(0.1);
}
function draw() {
    if (!gamestate) return;
    background(0);

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

    strokeWeight(0);

    gamestate.drones.forEach((drone) => {
        const scale = sizes.scale;
        const r = 0.5;   // in-world size
        const p = [drone.pos.x, drone.pos.y];
        const c = color(15, 3, 252);

        const radians = drone.input.rotation * Math.PI / 180;
        const p1 = [
            p[0] + r * Math.cos(radians),
            p[1] + r * Math.sin(radians),
        ];

        noFill();
        stroke(c);
        strokeWeight(sizes.strokeW);
        circle(...w2sp(p), w2ss(r*2));
        line(...w2sp(p), ...w2sp(p1));
    });
}

function windowResized() {
    onWindowResized();
}

/* temp */

const app = new Application(new Renderer(gamestate));
app.connect(config.host, config.port);

const timer = setInterval(() => {
    app.requestGameState();
}, 1000);
