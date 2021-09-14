const config = {
    host: 'localhost',
    port: '8081'
}

class Application {
    constructor() {
        this.gamestate = {};
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
        console.log(`gamestate: ${JSON.stringify(this.gamestate)}`);
    }

    requestGameState() {
        const request = {
            type: 'gamestate'
        };
        const message = JSON.stringify(request);
        this.socket.send(message);
    }

}

const app = new Application();
app.connect(config.host, config.port);

const timer = setInterval(() => {
    app.requestGameState();
}, 1000);
