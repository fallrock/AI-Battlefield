'use strict';

const start = () => {
    input.enginePower = 1;
    input.rotation = 90;
};

const update = () => {
    if (
            drone.pos.x <= 0
        ||  drone.pos.y <= 0
        ||  drone.pos.x >= game.map.w
        ||  drone.pos.y >= game.map.h
    ) {
        input.rotation = Math.random() * 360;
    }
};
