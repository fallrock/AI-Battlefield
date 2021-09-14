#!/usr/bin/env node
'use strict';
const dp = console.log;
const dv = () => {};

const engine = require('./engine.js');


let id = engine.createDrone();
engine.setDroneAI(id, (d, g) => ({
    enginePower: 1,
    rotation: d.input.rotation + 90,
}));
dp('\n'.repeat(300))

setInterval(() => {
    engine.onTick();
    dp(drawMap());
}, 500)

function drawMap() {
    let map = [];
    for (let y = 0; y < engine.gameState.map.h; y++) {
        map[y] = [];
        for (let x = 0; x < engine.gameState.map.w; x++) {
            map[y][x] = '.';
        }
    }
    for (let drone of engine.gameState.drones) {
        map[drone.pos.y][drone.pos.x] = '@';
    }
    let ss = '';
    for (let y = 0; y < engine.gameState.map.h; y++) {
        for (let x = 0; x < engine.gameState.map.w; x++) {
            ss += map[engine.gameState.map.h-1-y][x];
        }
        ss += '\n';
    }
    return ss;
}
