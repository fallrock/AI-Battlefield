'use strict';

let gameState = {
    drones: [],
    map: {
        w: 5,
        h: 5,
    },
};
module.exports.gameState = gameState;

module.exports.onTick = function() {
    _applyAI();
    _processWorld();
}

module.exports.exportState = function() {
    return JSON.stringify(gameState, null, 2);
}

module.exports.importState = function(data) {
    gameState = JSON.parse(data);
}

// Who will validate newLogicFn?
module.exports.setDroneAI = function(playerId, newLogicFn) {
    for (let drone of gameState.drones) {
        if (drone.id == playerId) {
            drone.ai = newLogicFn;
            break;
        }
    }
}

module.exports.createDrone = function() {
    let d = {};
    d.pos = {
        x: Math.floor(Math.random() * gameState.map.w),
        y: Math.floor(Math.random() * gameState.map.h),
    };
    d.id = (''+Math.random()).slice(2) + (''+Math.random()).slice(2);
    d.input = {
        enginePower: 1,
        rotation: 0,
    };
    d.ai = () => {};
    gameState.drones.push(d);
    return d.id;
}

function _applyAI() {
    for (let drone of gameState.drones) {
        let inp = drone.ai(drone, gameState);
        if (inp.rotation >= 360) { inp.rotation -= 360; }
        if (inp.rotation < 0) { inp.rotation += 360; }
        inp.enginePower = Math.max(0, Math.min(1, inp.enginePower));
        drone.input = { ...drone.input, ...inp };
    }
}

function _processWorld() {
    for (let drone of gameState.drones) {
        switch (drone.input.rotation) {
            case 0: {
                drone.pos.y += drone.input.enginePower;
                break;
            }
            case 90: {
                drone.pos.x += drone.input.enginePower;
                break;
            }
            case 180: {
                drone.pos.y -= drone.input.enginePower;
                break;
            }
            case 270: {
                drone.pos.x -= drone.input.enginePower;
                break;
            }
        }
        if (drone.pos.x < 0) { drone.pos.x = 0; }
        if (drone.pos.y < 0) { drone.pos.y = 0; }
        if (drone.pos.x >= gameState.map.w) { drone.pos.x = gameState.map.w - 1; }
        if (drone.pos.y >= gameState.map.h) { drone.pos.y = gameState.map.h - 1; }
    }
}
