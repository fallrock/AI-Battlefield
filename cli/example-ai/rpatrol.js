'use strict';

const start = () => {
    input.enginePower = 1;
    input.rotation = 90;
};

const update = () => {
    if (
            drone.pos.x <= 0
        ||  drone.pos.y <= 0
        ||  drone.pos.x >= gamestate.map.w
        ||  drone.pos.y >= gamestate.map.h
    ) {
        input.rotation = Math.random() * 360;
    }
};
