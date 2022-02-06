'use strict';

const gen = require('./gen.js');
const airunner = require('../AI-Runner/runner.js');

let gameState = {
    deltaTime: 1/4,
    drones: [],
    coins: [],
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

module.exports.setDroneAI = function(playerId, ai) {
    ///TODO: find drone in functional style
    for (let drone of gameState.drones) {
        if (drone.id == playerId) {
            drone.ai = ai;
            drone.ai_state.initialized = false;
            return;
        }
    }
    ///TODO: this function does not return or throw something bad in this case
    console.error(`Player with id <${playerId}> does not exist`);
}

module.exports.exportDroneAI = function(playerId) {
    for (let drone of gameState.drones) {
        if (drone.id == playerId) {
            return drone.ai.toString();
        }
    }
}

module.exports.exportDroneState = function(playerId) {
    for (let drone of gameState.drones) {
        if (drone.id == playerId) {
            return JSON.stringify(drone);
        }
    }
}

module.exports.createDrone = function() {
    let drone = {};
    drone.pos = gen.spawnPoint(gameState);
    drone.id = gen.id();
    drone.input = {
        enginePower: 0,
        rotation: 0,
    };
    drone.ai_state = {
        initialized: false,
        custom: {},
    };
    drone.ai = airunner.dummyAI;
    drone.score = 0;
    gameState.drones.push(drone);
    return drone.id;
}

function _applyAI() {
    for (let drone of gameState.drones) {
        ///TODO: try/catch, proper input validation
        try {
            const result = airunner.run(gameState, drone.id);
            drone.ai_state.initialized = result.initialized;
            drone.ai_state.custom = result.custom;

            const input = result.input;
            ///TODO: move this out of engine
            if (!input) { continue; }
            if (input.rotation >= 360) { input.rotation -= 360; }
            if (input.rotation < 0) { input.rotation += 360; }
            input.enginePower = Math.max(0, Math.min(1, input.enginePower));
            drone.input = input;
        } catch (error) {
            console.error(`ai failed: ${error}`);
        }
    }
}

function _spawnCoin() {
    let coin = {};
    coin.pos = gen.coinPoint(gameState);
    coin.radius = 0.25;
    gameState.coins.push(coin);
}

function _checkCollision(pointA, radiusA, pointB, radiusB) {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    return distance <= radiusA + radiusB;
}

function _processWorld() {
    // process drones
    for (let drone of gameState.drones) {
        const radians = drone.input.rotation * Math.PI / 180;
        const fwd = [
            Math.cos(radians),
            Math.sin(radians),
        ];
        const vel = fwd.map(e => e * drone.input.enginePower * gameState.deltaTime);
        drone.pos.x += vel[0];
        drone.pos.y += vel[1];
        if (drone.pos.x < 0) { drone.pos.x = 0; }
        if (drone.pos.y < 0) { drone.pos.y = 0; }
        if (drone.pos.x >= gameState.map.w) { drone.pos.x = gameState.map.w; }
        if (drone.pos.y >= gameState.map.h) { drone.pos.y = gameState.map.h; }
    }

    // spawn coins
    if (gameState.coins.length < gameState.drones.length) {
        _spawnCoin();
    }

    // process coins collisions
    for (let drone of gameState.drones) {
        for (let i = gameState.coins.length - 1; i >= 0; --i) {
            let coin = gameState.coins[i];
            // check collision
            if (_checkCollision(drone.pos, 0, coin.pos, coin.radius)) {
                drone.score = drone.score + 1;
                // console.log(drone.score);
                gameState.coins.splice(i, 1);
            }
        }
    }
}
