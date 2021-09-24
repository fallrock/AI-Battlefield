'use strict';

const start = () => {
    input.enginePower = 1;
    input.rotation = 90;
};

const update = () => {
    if (drone.pos.y <= 0) {
        input.rotation = 90;
    }
    if (drone.pos.y >= game.map.h) {
        input.rotation = 270;
    }
};
