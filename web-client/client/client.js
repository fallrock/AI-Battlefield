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
        let mapDims = {w: gamestate.map.width, h: gamestate.map.height};
        onMapChanged(mapDims);
        loop();
        console.log(gamestate.drones);
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
    createCanvas(100, 100);
    onWindowResized();
    // frameRate(2);
    noLoop();
}
function draw() {
    if (!gamestate) return; ///TODO fix
    background(0);

    const width = sizes.map.w;
    const height = sizes.map.h;
    fill(200, 200, 200);
    rect(0, 0, sizes.canvas.w, sizes.canvas.h);

    fill(58, 42, 161);

    gamestate.drones.forEach((drone) => {
        const scale = sizes.scale;
        const r = sizes.droneR;

        const x = drone.pos.x * scale;
        const y = drone.pos.y * scale;

        const radians = (360 - drone.input.rotation + 90) * Math.PI / 180;
        const x1 = x + r/2 * Math.cos(radians);
        const y1 = y + r/2 * Math.sin(radians);

        strokeWeight(0);
        circle(x, sizes.canvas.h - y, sizes.droneR);

        strokeWeight(sizes.strokeW);
        line(x, sizes.canvas.h - y, x1, sizes.canvas.h - y1);
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
