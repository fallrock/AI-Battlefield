'use strict';
return (

(drone, gamestate) => {
    const input = {
        enabled: drone.input.enabled,
        enginePower: 1
    };

    if (input.enabled === false) {
        input.enabled = true;
        input.rotation = 0;
    }

    if (drone.pos.y === 0 && drone.pos.x !== gamestate.map.w) {
        input.rotation = 0;
    }
    if (drone.pos.x === gamestate.map.w && drone.pos.y !== gamestate.map.h) {
        input.rotation = 90;
    }
    if (drone.pos.y === gamestate.map.h && drone.pos.x !== 0) {
        input.rotation = 180;
    }
    if (drone.pos.x === 0 && drone.pos.y !== 0) {
        input.rotation = 270;
    }

    return input;
}

).apply(this, arguments);
