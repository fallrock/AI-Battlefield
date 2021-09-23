'use strict';

drone.input.enginePower = 1;

if (drone.pos.y === 0 && drone.pos.x !== gamestate.map.w) {
    drone.input.rotation = 0;
}
if (drone.pos.x === gamestate.map.w && drone.pos.y !== gamestate.map.h) {
    drone.input.rotation = 90;
}
if (drone.pos.y === gamestate.map.h && drone.pos.x !== 0) {
    drone.input.rotation = 180;
}
if (drone.pos.x === 0 && drone.pos.y !== 0) {
    drone.input.rotation = 270;
}
