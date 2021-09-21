'use strict';

const gen = require('./gen.js');

let gameState = {
    tps: 10,
    drones: [],
    map: {
        w: 10,
        h: 10,
    },
};
module.exports.gameState = gameState;

module.exports.onTick = function() {
    _applyAI();
    _processWorld();
}

module.exports.exportState = function() {
    return JSON.stringify(gameState);
}

module.exports.importState = function(data) {
    gameState = JSON.parse(data);
}

module.exports.setDroneAI = function(playerId, newLogicFn) {
    for (let drone of gameState.drones) {
        if (drone.id == playerId) {
            drone.ai = newLogicFn;
            return;
        }
    }
    console.error(`Player with id <${playerId}> does not exist`);
}

module.exports.exportDroneAI = function(playerId) {
    for (let drone of gameState.drones) {
        if (drone.id == playerId) {
            return drone.ai.toString();
        }
    }
}

module.exports.createDrone = function() {
    let drone = {};
    drone.pos = gen.spawnPoint(gameState);
    drone.id = gen.id();
    drone.input = {
        enabled: false,
        enginePower: 0,
        rotation: 0,
    };
    drone.ai = () => {};
    gameState.drones.push(drone);
    return drone.id;
}

function _applyAI() {
    for (let drone of gameState.drones) {
        ///TODO: try/catch, proper input validation
        let inp = drone.ai(drone, gameState);
        if (!inp) { continue; }
        if (inp.rotation >= 360) { inp.rotation -= 360; }
        if (inp.rotation < 0) { inp.rotation += 360; }
        inp.enginePower = Math.max(0, Math.min(1, inp.enginePower));
        drone.input = { ...drone.input, ...inp };
    }
}

function _processWorld() {
    for (let drone of gameState.drones) {
        if (!drone.input.enabled) { continue; }
        const radians = drone.input.rotation * Math.PI / 180;
        const fwd = [
            Math.cos(radians),
            Math.sin(radians),
        ];
        const vel = fwd.map(e => e * drone.input.enginePower * 1/gameState.tps);
        drone.pos.x += vel[0];
        drone.pos.y += vel[1];
        if (drone.pos.x < 0) { drone.pos.x = 0; }
        if (drone.pos.y < 0) { drone.pos.y = 0; }
        if (drone.pos.x >= gameState.map.w) { drone.pos.x = gameState.map.w; }
        if (drone.pos.y >= gameState.map.h) { drone.pos.y = gameState.map.h; }
    }
}
