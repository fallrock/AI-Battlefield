'use strict';
return (

function(drone, gamestate) {
    let input = drone.input;

    input.enabled = true;
    input.enginePower = 1;
    input.rotation += 90;

    return input;
}

).apply(this, arguments);