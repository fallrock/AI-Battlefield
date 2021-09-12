///TODO: host/port
const socket = new WebSocket('ws://localhost:8081');

socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case 'gamestate':
            console.log(`gamestate: ${JSON.stringify(message.gamestate)}`);
            break;
        default:
            console.log(`unknown message type ${JSON.stringify(message)}`);
    }
});

const timer = setInterval(() => {
    const request = {
        type: 'gamestate'
    };
    socket.send(JSON.stringify(request));
}, 1000);
