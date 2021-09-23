'use strict';
const vm = require('vm');
const clone = require('just-clone');

const dummyAI = `'use strict'; const start = () => {}; const update = () => {};`;

// util
const find_drone = (id, gamestate) => {
  return gamestate.drones.find(d => d.id === id);
};

const create_context = (id, gamestate) => {
  const drone = find_drone(id, gamestate);
  const state = drone.ai_state;
  const data = {
    // mutable data
    initialized: state.initialized,
    custom: clone(state.custom),
    input: clone(drone.input),

    // read-only data:
    ///TODO: hide sensitive data
    gamestate: clone(gamestate),
    drone: clone(drone),
  };

  const context = vm.createContext(data);
  return context;
};

const compile_ai = (ai) => {
  const script = new vm.Script(ai);
  return script;
};

const export_methods = (script, context) => {
  const exported = script.runInContext(context);
  return exported;
};

const execute_ai = (ai, context, exported) => {
  context.start = exported.start;
  context.update = exported.update;
  const script = new vm.Script(`
    'use strict';
    if (initialized === false) {
      start();
      initialized = true;
    }
    update();
  `);
  script.runInContext(context);
  const result = {
    initialized: context.initialized,
    custom: context.custom,
    input: context.input
  };
  return result;
};

const run = (gamestate, id) => {
  const ai = compile_ai(find_drone(id, gamestate).ai);
  const context = create_context(id, gamestate);
  const exported = export_methods(ai, context);
  const result = execute_ai(ai, context, exported);
  return result;
};

module.exports = { run, dummyAI };
