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
    const width = gamestate.map.width;
    const height = gamestate.map.height;
    fill(200, 200, 200);
    rect(0, 0, width * mapScale, height * mapScale);

    fill(58, 42, 161);

    gamestate.drones.forEach((drone) => {
        const r = 1;
        const { x, y } = drone.pos;
        strokeWeight(0);
        circle((x + r / 2) * mapScale, (height - (y + r / 2)) * mapScale, r * mapScale);
        strokeWeight(1);

        const radians = (360 - drone.input.rotation + 90) * Math.PI / 180;
        const x1 = x + (r / 2) * Math.cos(radians);
        const y1 = y + (r / 2) * Math.sin(radians);
        line((x + r / 2) * mapScale, (height - (y + r / 2)) * mapScale, (x1 + r / 2) * mapScale, (height - (y1 + r / 2)) * mapScale);
    });
}
/* temp */

const app = new Application(new Renderer(gamestate));
app.connect(config.host, config.port);

const timer = setInterval(() => {
    app.requestGameState();
}, 1000);
