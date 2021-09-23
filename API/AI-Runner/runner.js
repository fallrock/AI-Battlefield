'use strict';
const vm = require('vm');

const dummyAI = `
    'use strict';
    const start = () => {};
    const update = () => {};
  `;

// util
const find_drone = (id, gamestate) => {
  return gamestate.drones.find(d => d.id === id);
};

///TODO: filter visibility and r/w permissions here (ai interface)
const create_context = (id, gamestate) => {
  const drone = find_drone(id, gamestate);
  const state = drone.ai_state;
  const data = {
    initialized: state.initialized,
    custom: state.custom,
    input: drone.input,

    // read-only data:
    drone: drone,
    gamestate: gamestate,
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
  ///TODO: apply ai properly
  // console.log(result);
  return result.input;
};

module.exports = { run, dummyAI };
