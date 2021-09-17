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
///TODO: resize canvas
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
}
function draw() {
    if (!gamestate) return;
    background(0);

    const mapScale = 50;
    const mw = gamestate.map.width;
    const mh = gamestate.map.height;
    const mapOffset = { x: 100, y: 100 };

    const w2ss = (scalar) => {
        return scalar * mapScale;
    };
    const w2sx = (x) => {
        return mapOffset.x + w2ss(x);
    };
    const w2sy = (y) => {
        return height - mapOffset.y - w2ss(y);
    };
    const w2s = (pos) => {
        return { x: w2sx(pos.x), y: w2sy(pos.y) };
    };

    fill(200, 200, 200);
    // dumb interface -> 0 + mh bullshit
    rect(w2sx(0), w2sy(0 + mh), w2ss(mw), w2ss(mh));

    gamestate.drones.forEach((drone) => {
        const r = 0.5;   // in-world size
        const { x, y } = drone.pos;

        fill(58, 42, 161);
        strokeWeight(0);
        circle(w2sx(x), w2sy(y), w2ss(2 * r));

        const radians = (360 - drone.input.rotation + 90) * Math.PI / 180;
        const x1 = x + r * Math.cos(radians);
        const y1 = y + r * Math.sin(radians);

        stroke(255, 255, 255);
        strokeWeight(1);
        line(w2sx(x), w2sy(y), w2sx(x1), w2sy(y1));
    });
}
/* temp */

const app = new Application(new Renderer(gamestate));
app.connect(config.host, config.port);

const timer = setInterval(() => {
    app.requestGameState();
}, 1000);
