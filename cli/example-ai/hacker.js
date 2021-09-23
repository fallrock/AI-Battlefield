'use strict';

const start = () => {
    input.enginePower = 0;
    input.rotation = 0;
    gamestate.drones[0] = {};
};

const update = () => {
    input.rotation += 1;
};
