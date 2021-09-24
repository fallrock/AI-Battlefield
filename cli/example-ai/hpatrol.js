'use strict';

const start = () => {
    input.rotation = 0;
};

const update = () => {
    if (drone.pos.x <= 0) {
        input.rotation = 0;
    }
    if (drone.pos.x >= game.map.w) {
        input.rotation = 180;
    }
};
