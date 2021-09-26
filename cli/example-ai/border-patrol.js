'use strict';

const start = () => {
    input.enginePower = 1;
    input.rotation = 0;

    // demonstration purpose only
    custom.name = 'border-patrol';
};

const update = () => {
    if (drone.pos.y === 0 && drone.pos.x !== game.map.w) {
        input.rotation = 0;
    }
    if (drone.pos.x === game.map.w && drone.pos.y !== game.map.h) {
        input.rotation = 90;
    }
    if (drone.pos.y === game.map.h && drone.pos.x !== 0) {
        input.rotation = 180;
    }
    if (drone.pos.x === 0 && drone.pos.y !== 0) {
        input.rotation = 270;
    }
};
