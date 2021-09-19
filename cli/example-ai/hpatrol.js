'use strict';
return (

function(drone, gamestate) {
    let input = drone.input;

    if (input.enabled == false) {
        input.enabled = true;
        input.enginePower = 1;
        input.rotation = 0;
    }

    if (drone.pos.x <= 0) {
        input.rotation = 0;
    }
    if (drone.pos.x >= gamestate.map.w) {
        input.rotation = 180;
    }

    return input;
}

).apply(this, arguments);
