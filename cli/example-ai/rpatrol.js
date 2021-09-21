'use strict';
return (

function(drone, gamestate) {
    let input = drone.input;

    if (input.enabled == false) {
        input.enabled = true;
        input.enginePower = 1;
        input.rotation = 90;
    }

    if (
        drone.pos.x <= 0 || drone.pos.y <= 0 ||
        drone.pos.x >= gamestate.map.w || drone.pos.y >= gamestate.map.h
    ) {
        input.rotation = Math.random() * 360;
    }

    return input;
}

).apply(this, arguments);
