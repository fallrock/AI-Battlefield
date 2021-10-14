'use strict';
const vm = require('vm');
const clone = require('just-clone');

const dummyAI = `'use strict'; const start = () => {}; const update = () => {};`;

// util
const find_drone = (id, gamestate) => {
  return gamestate.drones.find(d => d.id === id);
};

///TODO: move this logic somewhere else
const filter_gameview = (id, gamestate) => {
  const game = clone(gamestate);

  const player = find_drone(id, game);

  game.drones = game.drones.filter(d => d !== player);
  game.drones.sort((a, b) => {
    const dist = (first, second) => {
      const delta = (a, b) => {return {
        x: a.x - b.x,
        y: a.y - b.y,
      }};
      const mag = (a) => Math.sqrt(a.x * a.x + a.y * a.y);

      return mag(delta(first, second));
    };

    const d1 = dist(player.pos, a.pos);
    const d2 = dist(player.pos, b.pos);

    return d1 - d2;
  });

  const gameview = {
    game: game,
    drone: player,
  };
  return gameview;
};

const create_context = (id, gamestate) => {
  const drone = find_drone(id, gamestate);
  const state = drone.ai_state;
  const data = {
    // mutable data
    initialized: state.initialized,
    custom: clone(state.custom),
    input: clone(drone.input),  ///TODO: move input to drone (view drone.pos && edit drone.rotation)

    // read-only data:
    ...filter_gameview(id, gamestate),
  };

  const context = vm.createContext(data);
  return context;
};

const compile_ai = (ai) => {
  const script = new vm.Script(ai);
  return script;
};

/* get start and update functions from ai */
const export_methods = (script, context) => {
  const exported = script.runInContext(context);
  return exported;
};

const execute_ai = (context, exported) => {
  context.start = exported.start;
  context.update = exported.update;
  const script = new vm.Script(`
    'use strict';
    if (initialized === false) {
      if (start) {
        start();
      }
      initialized = true;
    }
    if (update) {
      update();
    }
  `);
  script.runInContext(context);
  const result = {
    initialized: context.initialized,
    custom: context.custom,
    input: context.input
  };
  return result;
};

const run = (gamestate, id, ai_code) => {
  const ai = compile_ai(ai_code);
  const context = create_context(id, gamestate);
  const exported = export_methods(ai, context);
  const result = execute_ai(context, exported);
  return result;
};

module.exports = { run, dummyAI };

(function main() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', function(line){
        const data = JSON.parse(line);
        const result = run(data.engine, data.id, data.ai);
        rl.write(JSON.stringify(result));
    })
})();
