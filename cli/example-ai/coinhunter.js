'use strict';

const start = () => {
    input.enginePower = 1;
    input.rotation = 90;
    custom.log = [];
};

const update = () => {
    const log = (msg) => custom.log.push(msg);

    if (game.coins.length === 0) {
        input.enginePower = 0;
        return;
    }
    input.enginePower = 1;
    const target_pos = game.coins[0].pos;
    const d = {
        x: target_pos.x - drone.pos.x,
        y: target_pos.y - drone.pos.y
    };
    // log(d);
    const angle = Math.atan2(d.y, d.x) * 180.0 / Math.PI;
    input.rotation = angle;
};
