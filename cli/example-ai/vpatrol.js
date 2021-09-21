'use strict';
return (

function(drone, gamestate) {
    let input = drone.input;

    if (input.enabled == false) {
        input.enabled = true;
        input.enginePower = 1;
        input.rotation = 90;
    }

    if (drone.pos.y <= 0) {
        input.rotation = 90;
    }
    if (drone.pos.y >= gamestate.map.h) {
        input.rotation = 270;
    }

    return input;
}

).apply(this, arguments);
